'use strict';

import { initializeUIRuntime } from './initializers';
import { WorkletsModule } from './WorkletsModule';

// TODO: Specify the initialization pipeline since now there's no
// universal source of truth for it.
initializeUIRuntime(WorkletsModule);

export type { CustomError } from './errors';
export {
  createCustomError,
  registerCustomError,
  registerWorkletStackDetails,
  reportFatalErrorOnJS,
} from './errors';
export { setupCallGuard, setupConsole } from './initializers';
export type { LoggerConfig } from './logger';
export {
  logger,
  LogLevel,
  registerLoggerConfig,
  updateLoggerConfig,
} from './logger';
export { mockedRequestAnimationFrame } from './mockedRequestAnimationFrame';
export { createWorkletRuntime, runOnRuntime } from './runtimes';
export { shareableMappingCache } from './shareableMappingCache';
export {
  makeShareable,
  makeShareableCloneOnUIRecursive,
  makeShareableCloneRecursive,
} from './shareables';
export {
  callMicrotasks,
  executeOnUIRuntimeSync,
  runOnJS,
  runOnUI,
  runOnUIImmediately,
} from './threads';
export { isWorkletFunction } from './workletFunction';
export type { IWorkletsModule, WorkletsModuleProxy } from './WorkletsModule';
export { WorkletsModule } from './WorkletsModule';
export type {
  ShareableRef,
  WorkletFunction,
  WorkletFunctionDev,
  WorkletRuntime,
  WorkletStackDetails,
} from './workletTypes';
