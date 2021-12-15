// This is based on https://github.com/pimterry/loglevel
import { isString } from "./util/types";
import { entries } from "./util/object";
const _loggers = {};
export class LogLevel {
    constructor(name, level) {
        this.name = name;
        this.level = level;
    }
}
LogLevel.__name__ = "LogLevel";
export class Logger {
    constructor(name, level = Logger.INFO) {
        this._name = name;
        this.set_level(level);
    }
    static get levels() {
        return Object.keys(Logger.log_levels);
    }
    static get(name, level = Logger.INFO) {
        if (name.length > 0) {
            let logger = _loggers[name];
            if (logger == null)
                _loggers[name] = logger = new Logger(name, level);
            return logger;
        }
        else
            throw new TypeError("Logger.get() expects a non-empty string name and an optional log-level");
    }
    get level() {
        return this.get_level();
    }
    get_level() {
        return this._log_level;
    }
    set_level(log_level) {
        if (log_level instanceof LogLevel)
            this._log_level = log_level;
        else if (isString(log_level) && Logger.log_levels[log_level] != null)
            this._log_level = Logger.log_levels[log_level];
        else
            throw new Error("Logger.set_level() expects a log-level object or a string name of a log-level");
        const logger_name = `[${this._name}]`;
        for (const [name, log_level] of entries(Logger.log_levels)) {
            if (log_level.level < this._log_level.level || this._log_level.level === Logger.OFF.level)
                this[name] = function () { };
            else
                this[name] = _method_factory(name, logger_name);
        }
    }
    trace(..._args) { }
    debug(..._args) { }
    info(..._args) { }
    warn(..._args) { }
    error(..._args) { }
}
Logger.__name__ = "Logger";
Logger.TRACE = new LogLevel("trace", 0);
Logger.DEBUG = new LogLevel("debug", 1);
Logger.INFO = new LogLevel("info", 2);
Logger.WARN = new LogLevel("warn", 6);
Logger.ERROR = new LogLevel("error", 7);
Logger.FATAL = new LogLevel("fatal", 8);
Logger.OFF = new LogLevel("off", 9);
Logger.log_levels = {
    trace: Logger.TRACE,
    debug: Logger.DEBUG,
    info: Logger.INFO,
    warn: Logger.WARN,
    error: Logger.ERROR,
    fatal: Logger.FATAL,
    off: Logger.OFF,
};
function _method_factory(method_name, logger_name) {
    if (console[method_name] != null)
        return console[method_name].bind(console, logger_name);
    else if (console.log != null)
        return console.log.bind(console, logger_name);
    else
        return function () { };
}
export const logger = Logger.get("bokeh");
export function set_log_level(level) {
    const previous_level = logger.level;
    if (isString(level) && Logger.log_levels[level] == null) {
        console.log(`[bokeh] unrecognized logging level '${level}' passed to Bokeh.set_log_level(), ignoring`);
        console.log(`[bokeh] valid log levels are: ${Logger.levels.join(', ')}`);
    }
    else {
        console.log(`[bokeh] setting log level to: '${isString(level) ? level : level.level}'`);
        logger.set_level(level);
    }
    return previous_level;
}
export function with_log_level(level, fn) {
    const original = set_log_level(level);
    try {
        fn();
    }
    finally {
        set_log_level(original);
    }
}
//# sourceMappingURL=logging.js.map