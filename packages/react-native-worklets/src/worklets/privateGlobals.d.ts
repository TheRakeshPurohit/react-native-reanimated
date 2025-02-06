/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
'use strict';

// This file works by accident - currently Builder Bob doesn't move `.d.ts` files to output types.
// If it ever breaks, we should address it so we'd not pollute the user's global namespace.
import type { callGuardDEV } from './initializers';
import type { WorkletsModuleProxy } from './WorkletsModule';

declare global {
  var __workletsCache: Map<string, any>;
  var __handleCache: WeakMap<object, any>;
  var evalWithSourceMap:
    | ((js: string, sourceURL: string, sourceMap: string) => any)
    | undefined;
  var evalWithSourceUrl: ((js: string, sourceURL: string) => any) | undefined;
  var _toString: (value: unknown) => string;
  var __workletsModuleProxy: WorkletsModuleProxy | undefined;
  var _WORKLET: boolean | undefined;
  var _makeShareableClone: <T>(
    value: T,
    nativeStateSource?: object
  ) => FlatShareableRef<T>;
  var __callMicrotasks: () => void;
  var _maybeFlushUIUpdatesQueue: () => void;
  var _scheduleHostFunctionOnJS: (fun: (...args: A) => R, args?: A) => void;
  var _scheduleRemoteFunctionOnJS: (fun: (...args: A) => R, args?: A) => void;
  var __ErrorUtils: {
    reportFatalError: (error: Error) => void;
  };
  var __callGuardDEV: typeof callGuardDEV | undefined;
  var __flushAnimationFrame: (timestamp: number) => void;
  var __frameTimestamp: number | undefined;
  var __workletsLoggerConfig: LoggerConfigInternal;
  var _log: (value: unknown) => void;
  var _getAnimationTimestamp: () => number;
  var _scheduleOnRuntime: (
    runtime: WorkletRuntime,
    worklet: ShareableRef<() => void>
  ) => void;
}
