'use strict';
import { addLogBoxLog } from './LogBox';
import type { LogData, LogBoxLogLevel } from './LogBox';

type LogFunction = (data: LogData) => void;

export enum LogLevel {
  warn = 1,
  error = 2,
  fatal = 3,
}

export type LoggerConfig = {
  level?: LogLevel;
  strict?: boolean;
};

export type LoggerConfigInternal = {
  logFunction: LogFunction;
} & Required<LoggerConfig>;

function logToConsole(data: LogData) {
  'worklet';
  switch (data.level) {
    case 'warn':
      console.warn(data.message.content);
      break;
    case 'error':
    case 'fatal':
    case 'syntax':
      console.error(data.message.content);
      break;
  }
}

export const DEFAULT_LOGGER_CONFIG: LoggerConfigInternal = {
  logFunction: logToConsole,
  level: LogLevel.warn,
  strict: false,
};

function formatMessage(message: string) {
  'worklet';
  return `[Reanimated] ${message}`;
}

function createLog(level: LogBoxLogLevel, message: string): LogData {
  'worklet';
  const formattedMessage = formatMessage(message);

  return {
    level,
    message: {
      content: formattedMessage,
      substitutions: [],
    },
    category: formattedMessage,
    componentStack: [],
    componentStackType: null,
    // eslint-disable-next-line reanimated/use-reanimated-error
    stack: new Error().stack,
  };
}

/**
 * Function that logs to LogBox and console.
 * Used to replace the default console logging with logging to LogBox
 * on the UI thread when runOnJS is available.
 *
 * @param data - The details of the log.
 */
export function logToLogBoxAndConsole(data: LogData) {
  addLogBoxLog(data);
  logToConsole(data);
}

/**
 * Registers the logger configuration.
 * use it only for Worklet runtimes.
 *
 * @param config - The config to register.
 */
export function registerLoggerConfig(config: LoggerConfigInternal) {
  'worklet';
  global.__reanimatedLoggerConfig = config;
}

/**
 * Replaces the default log function with a custom implementation.
 *
 * @param logFunction - The custom log function.
 */
export function replaceLoggerImplementation(logFunction: LogFunction) {
  'worklet';
  registerLoggerConfig({ ...__reanimatedLoggerConfig, logFunction });
}

/**
 * Updates logger configuration.
 *
 * @param options - The new logger configuration to apply.
 *   - level: The minimum log level to display.
 *   - strict: Whether to log warnings and errors that are not strict.
 *    Defaults to false.
 */
export function updateLoggerConfig(options?: Partial<LoggerConfig>) {
  'worklet';
  registerLoggerConfig({
    ...__reanimatedLoggerConfig,
    // Don't reuse previous level and strict values from the global config
    level: options?.level ?? LogLevel.warn,
    strict: options?.strict ?? false,
  });
}

type LogOptions = {
  strict?: boolean;
};

function handleLog(
  level: Exclude<LogBoxLogLevel, 'syntax'>,
  message: string,
  options: LogOptions
) {
  'worklet';
  const config = __reanimatedLoggerConfig;
  if (
    // Don't log if the log is marked as strict-only and the config doesn't
    // enable strict logging
    (options.strict && !config.strict) ||
    // Don't log if the log level is below the minimum configured level
    LogLevel[level] < config.level
  ) {
    return;
  }
  config.logFunction(createLog(level, message));
}

export const logger = {
  warn(message: string, options: LogOptions = {}) {
    'worklet';
    handleLog('warn', message, options);
  },
  error(message: string, options: LogOptions = {}) {
    'worklet';
    handleLog('error', message, options);
  },
  fatal(message: string, options: LogOptions = {}) {
    'worklet';
    handleLog('fatal', message, options);
  },
};
