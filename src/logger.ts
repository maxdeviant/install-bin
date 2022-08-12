enum LogLevel {
  Error = 1,
  Warn,
  Info,
  Debug,
  Trace,
}

export enum LogLevelFilter {
  Off,
  Error,
  Warn,
  Info,
  Debug,
  Trace,
}

export type LogLevelFilterString =
  | 'off'
  | 'error'
  | 'warn'
  | 'info'
  | 'debug'
  | 'trace';

const toLogLevelFilter = (value: LogLevelFilterString) => {
  switch (value) {
    case 'off':
      return LogLevelFilter.Off;
    case 'error':
      return LogLevelFilter.Error;
    case 'warn':
      return LogLevelFilter.Warn;
    case 'info':
      return LogLevelFilter.Info;
    case 'debug':
      return LogLevelFilter.Debug;
    case 'trace':
      return LogLevelFilter.Trace;
    default:
      throw new TypeError(`Invalid log level filter: '${value}'.`);
  }
};

export class Logger {
  private readonly levelFilter: LogLevelFilter;

  constructor(levelFilter: LogLevelFilter | LogLevelFilterString) {
    this.levelFilter =
      typeof levelFilter === 'string'
        ? toLogLevelFilter(levelFilter)
        : levelFilter;
  }

  private makeLog =
    (level: LogLevel) =>
    (message: any, ...params: any[]) => {
      if (level <= this.levelFilter) {
        console.error(message, ...params);
      }
    };

  error = this.makeLog(LogLevel.Error);
  warn = this.makeLog(LogLevel.Warn);
  info = this.makeLog(LogLevel.Info);
  debug = this.makeLog(LogLevel.Debug);
  trace = this.makeLog(LogLevel.Trace);
}
