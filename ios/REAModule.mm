#import <React/RCTBridge+Private.h>
#import <React/RCTScheduler.h>
#import <React/RCTSurfacePresenter.h>

#import "REAModule.h"
#import "REANodesManager.h"
#import "ReanimatedUIManagerBinding.h"
#import "native/NativeProxy.h"

using namespace facebook::react;
using namespace reanimated;

typedef void (^AnimatedOperation)(REANodesManager *nodesManager);

@implementation REAModule {
  NSMutableArray<AnimatedOperation> *_operations;
  __weak RCTSurfacePresenter *_surfacePresenter;
}

RCT_EXPORT_MODULE(ReanimatedModule);

- (void)invalidate
{
  [_nodesManager invalidate];
}

- (dispatch_queue_t)methodQueue
{
  // This module needs to be on the same queue as the UIManager to avoid
  // having to lock `_operations` and `_preOperations` since `uiManagerWillPerformMounting`
  // will be called from that queue.
  return RCTGetUIManagerQueue();
}

+ (BOOL)requiresMainQueueSetup
{
  return true;
}

- (void)installReanimatedModuleHostObject
{
  RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
  if (!cxxBridge.runtime) {
    return;
  }
  jsi::Runtime &runtime = *(jsi::Runtime *)cxxBridge.runtime;

  RCTScheduler *scheduler = [_surfacePresenter scheduler];
  std::shared_ptr<UIManager> uiManager = scheduler.uiManager;
  RuntimeExecutor syncRuntimeExecutor = [&](std::function<void(jsi::Runtime & runtime_)> &&callback) {
    callback(runtime);
  };
  ReanimatedUIManagerBinding::createAndInstallIfNeeded(runtime, syncRuntimeExecutor, uiManager);
}

#pragma mark-- Initialize

- (void)setBridge:(RCTBridge *)bridge
{
  [super setBridge:bridge];
  if (self.bridge) {
    _surfacePresenter = self.bridge.surfacePresenter;
  } else {
    // _surfacePresenter set in setSurfacePresenter:
  }

  _nodesManager = [[REANodesManager alloc] initWithModule:self bridge:self.bridge surfacePresenter:_surfacePresenter];

  [self installReanimatedModuleHostObject];

  [_surfacePresenter addObserver:self];
  [[self.moduleRegistry moduleForName:"EventDispatcher"] addDispatchObserver:self];

  _operations = [NSMutableArray new];
  [bridge.uiManager.observerCoordinator addObserver:self];
}

RCT_EXPORT_METHOD(installTurboModule)
{
  // TODO: Move initialization from UIResponder+Reanimated to here
}

#pragma mark-- Transitioning API

RCT_EXPORT_METHOD(triggerRender)
{
  [self addOperationBlock:^(REANodesManager *nodesManager) {
    [nodesManager postRunUpdatesAfterAnimation];
  }];
}

#pragma mark-- Batch handling

- (void)addOperationBlock:(AnimatedOperation)operation
{
  [_operations addObject:operation];
}

#pragma mark - RCTSurfacePresenterObserver

- (void)willMountComponentsWithRootTag:(NSInteger)rootTag
{
  RCTAssertMainQueue();

  RCTExecuteOnUIManagerQueue(^{
    if (_operations.count == 0) {
      return;
    }
    NSArray<AnimatedOperation> *operations = _operations;
    _operations = [NSMutableArray new];
    REANodesManager *nodesManager = _nodesManager;

    RCTExecuteOnMainQueue(^{
      for (AnimatedOperation operation in operations) {
        operation(nodesManager);
      }
      [nodesManager operationsBatchDidComplete];
    });
  });
}

RCT_EXPORT_METHOD(setValue : (nonnull NSNumber *)nodeID newValue : (nonnull NSNumber *)newValue)
{
  [self addOperationBlock:^(REANodesManager *nodesManager) {
    [nodesManager setValueForNodeID:nodeID value:newValue];
  }];
}

- (void)didMountComponentsWithRootTag:(NSInteger)rootTag
{
  RCTAssertMainQueue();
  RCTExecuteOnUIManagerQueue(^{
    /*NSArray<AnimatedOperation> *operations = self->_operations;
    self->_operations = [NSMutableArray new];*/

    RCTExecuteOnMainQueue(^{
        /*for (AnimatedOperation operation in operations) {
          operation(self->_nodesManager);
        }*/
    });
  });
}

#pragma mark - RCTUIManagerObserver

- (void)uiManagerWillPerformMounting:(RCTUIManager *)uiManager
{
  [_nodesManager maybeFlushUpdateBuffer];
  if (_operations.count == 0) {
    return;
  }

  NSArray<AnimatedOperation> *operations = _operations;
  _operations = [NSMutableArray new];

  REANodesManager *nodesManager = _nodesManager;

  [uiManager addUIBlock:^(__unused RCTUIManager *manager, __unused NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    for (AnimatedOperation operation in operations) {
      operation(nodesManager);
    }
    [nodesManager operationsBatchDidComplete];
  }];
}

#pragma mark-- Events

- (NSArray<NSString *> *)supportedEvents
{
  return @[ @"onReanimatedCall", @"onReanimatedPropsChange" ];
}

- (void)eventDispatcherWillDispatchEvent:(id<RCTEvent>)event
{
  // Events can be dispatched from any queue
  [_nodesManager dispatchEvent:event];
}

@end
