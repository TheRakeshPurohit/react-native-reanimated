#pragma once

#include <ReactCommon/CallInvoker.h>
#include <ReactCommon/TurboModule.h>

#include <memory>
#include <string>
#include <vector>

using namespace facebook;
using namespace react;

namespace reanimated {

class JSI_EXPORT ReanimatedModuleProxySpec : public TurboModule {
 protected:
  explicit ReanimatedModuleProxySpec(
      const std::shared_ptr<CallInvoker> &jsInvoker);

 public:
  // events
  virtual jsi::Value registerEventHandler(
      jsi::Runtime &rt,
      const jsi::Value &worklet,
      const jsi::Value &eventName,
      const jsi::Value &emitterReactTag) = 0;
  virtual void unregisterEventHandler(
      jsi::Runtime &rt,
      const jsi::Value &registrationId) = 0;

  // views
  virtual jsi::Value getViewProp(
      jsi::Runtime &rt,
#ifdef RCT_NEW_ARCH_ENABLED
      const jsi::Value &shadowNodeWrapper,
#else
      const jsi::Value &viewTag,
#endif
      const jsi::Value &propName,
      const jsi::Value &callback) = 0;

  // sensors
  virtual jsi::Value registerSensor(
      jsi::Runtime &rt,
      const jsi::Value &sensorType,
      const jsi::Value &interval,
      const jsi::Value &iosReferenceFrame,
      const jsi::Value &sensorDataContainer) = 0;
  virtual void unregisterSensor(
      jsi::Runtime &rt,
      const jsi::Value &sensorId) = 0;

  // keyboard
  virtual jsi::Value subscribeForKeyboardEvents(
      jsi::Runtime &rt,
      const jsi::Value &keyboardEventContainer,
      const jsi::Value &isStatusBarTranslucent,
      const jsi::Value &isNavigationBarTranslucent) = 0;
  virtual void unsubscribeFromKeyboardEvents(
      jsi::Runtime &rt,
      const jsi::Value &listenerId) = 0;

  // other
  virtual jsi::Value enableLayoutAnimations(
      jsi::Runtime &rt,
      const jsi::Value &config) = 0;
  virtual jsi::Value configureProps(
      jsi::Runtime &rt,
      const jsi::Value &uiProps,
      const jsi::Value &nativeProps) = 0;

  // layout animations
  virtual jsi::Value configureLayoutAnimationBatch(
      jsi::Runtime &rt,
      const jsi::Value &layoutAnimationsBatch) = 0;

  virtual void setShouldAnimateExiting(
      jsi::Runtime &rt,
      const jsi::Value &viewTag,
      const jsi::Value &shouldAnimate) = 0;

#ifdef RCT_NEW_ARCH_ENABLED

  // JS View style
  virtual void setViewStyle(
      jsi::Runtime &rt,
      const jsi::Value &viewTag,
      const jsi::Value &viewStyle) = 0;
  virtual void removeViewStyle(jsi::Runtime &rt, const jsi::Value &viewTag) = 0;

  // CSS animations
  virtual void registerCSSAnimation(
      jsi::Runtime &rt,
      const jsi::Value &shadowNodeWrapper,
      const jsi::Value &animationId,
      const jsi::Value &animationConfig) = 0;
  virtual void updateCSSAnimation(
      jsi::Runtime &rt,
      const jsi::Value &animationId,
      const jsi::Value &settingsUpdates) = 0;
  virtual void unregisterCSSAnimations(
      jsi::Runtime &rt,
      const jsi::Value &animationIds) = 0;

  // CSS transitions
  virtual void registerCSSTransition(
      jsi::Runtime &rt,
      const jsi::Value &shadowNodeWrapper,
      const jsi::Value &transitionConfig) = 0;
  virtual void updateCSSTransition(
      jsi::Runtime &rt,
      const jsi::Value &viewTag,
      const jsi::Value &configUpdates) = 0;
  virtual void unregisterCSSTransition(
      jsi::Runtime &rt,
      const jsi::Value &viewTag) = 0;

#endif // RCT_NEW_ARCH_ENABLED
};

} // namespace reanimated
