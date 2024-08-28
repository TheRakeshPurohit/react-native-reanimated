'use strict';
import { registerReanimatedError, reportFatalErrorOnJS } from './errors';
import { isChromeDebugger, isJest, shouldBeUseWeb } from './PlatformChecker';
import {
  runOnJS,
  setupMicrotasks,
  callMicrotasks,
  runOnUIImmediately,
  executeOnUIRuntimeSync,
} from './threads';
import { mockedRequestAnimationFrame } from './mockedRequestAnimationFrame';
import type { LogData } from './logger';
import {
  logger,
  logToLogBoxAndConsole,
  replaceLoggerImplementation,
} from './logger';
import { makeShareableCloneRecursive } from './shareables';
import { shareableMappingCache } from './shareableMappingCache';

const IS_JEST = isJest();
const SHOULD_BE_USE_WEB = shouldBeUseWeb();
const IS_CHROME_DEBUGGER = isChromeDebugger();

// Register ReanimatedError in the UI global scope.
// (we are using `executeOnUIRuntimeSync` here to make sure that the error is
// registered before any async operations are executed on the UI runtime)
if (!shouldBeUseWeb()) {
  executeOnUIRuntimeSync(registerReanimatedError)();
}

// Override the logFunction implementation with the one that adds logs
// with better stack traces to the LogBox (need to override it after `runOnJS`
// is defined).
replaceLoggerImplementation((data: LogData) => {
  'worklet';
  runOnJS(logToLogBoxAndConsole)(data);
});
shareableMappingCache.set(logger, makeShareableCloneRecursive(logger));

// callGuard is only used with debug builds
export function callGuardDEV<Args extends unknown[], ReturnValue>(
  fn: (...args: Args) => ReturnValue,
  ...args: Args
): ReturnValue | void {
  'worklet';
  try {
    return fn(...args);
  } catch (e) {
    if (global.__ErrorUtils) {
      global.__ErrorUtils.reportFatalError(e as Error);
    } else {
      throw e;
    }
  }
}

export function setupCallGuard() {
  'worklet';
  global.__callGuardDEV = callGuardDEV;
  global.__ErrorUtils = {
    reportFatalError: (error: Error) => {
      runOnJS(reportFatalErrorOnJS)({
        message: error.message,
        stack: error.stack,
      });
    },
  };
}

// We really have to create a copy of console here. Function runOnJS we use on elements inside
// this object makes it not configurable
const capturableConsole = { ...console };

export function setupConsole() {
  'worklet';
  if (!IS_CHROME_DEBUGGER) {
    // @ts-ignore TypeScript doesn't like that there are missing methods in console object, but we don't provide all the methods for the UI runtime console version
    global.console = {
      /* eslint-disable @typescript-eslint/unbound-method */
      assert: runOnJS(capturableConsole.assert),
      debug: runOnJS(capturableConsole.debug),
      log: runOnJS(capturableConsole.log),
      warn: runOnJS(capturableConsole.warn),
      error: runOnJS(capturableConsole.error),
      info: runOnJS(capturableConsole.info),
      /* eslint-enable @typescript-eslint/unbound-method */
    };
  }
}

function setupRequestAnimationFrame() {
  'worklet';

  // Jest mocks requestAnimationFrame API and it does not like if that mock gets overridden
  // so we avoid doing requestAnimationFrame batching in Jest environment.
  const nativeRequestAnimationFrame = global.requestAnimationFrame;

  let animationFrameCallbacks: Array<(timestamp: number) => void> = [];
  let flushRequested = false;

  global.__flushAnimationFrame = (frameTimestamp: number) => {
    const currentCallbacks = animationFrameCallbacks;
    animationFrameCallbacks = [];
    currentCallbacks.forEach((f) => f(frameTimestamp));
    callMicrotasks();
  };

  global.requestAnimationFrame = (
    callback: (timestamp: number) => void
  ): number => {
    animationFrameCallbacks.push(callback);
    if (!flushRequested) {
      flushRequested = true;
      nativeRequestAnimationFrame((timestamp) => {
        flushRequested = false;
        global.__frameTimestamp = timestamp;
        global.__flushAnimationFrame(timestamp);
        global.__frameTimestamp = undefined;
      });
    }
    // Reanimated currently does not support cancelling callbacks requested with
    // requestAnimationFrame. We return -1 as identifier which isn't in line
    // with the spec but it should give users better clue in case they actually
    // attempt to store the value returned from rAF and use it for cancelling.
    return -1;
  };
}

export function initializeUIRuntime() {
  if (IS_JEST) {
    // requestAnimationFrame react-native jest's setup is incorrect as it polyfills
    // the method directly using setTimeout, therefore the callback doesn't get the
    // expected timestamp as the only argument: https://github.com/facebook/react-native/blob/main/packages/react-native/jest/setup.js#L28
    // We override this setup here to make sure that callbacks get the proper timestamps
    // when executed. For non-jest environments we define requestAnimationFrame in setupRequestAnimationFrame
    // @ts-ignore TypeScript uses Node definition for rAF, setTimeout, etc which returns a Timeout object rather than a number
    globalThis.requestAnimationFrame = mockedRequestAnimationFrame;
  }

  runOnUIImmediately(() => {
    'worklet';
    setupCallGuard();
    setupConsole();
    if (!SHOULD_BE_USE_WEB) {
      setupMicrotasks();
      setupRequestAnimationFrame();
    }
  })();
}
