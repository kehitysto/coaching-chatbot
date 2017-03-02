const Logger = {
    setLevel,

    error,
    warning,
    info,
    debug,
    silly,
};

const LEVELS = {
    ERROR: 0,
    WARNING: 1,
    INFO: 2,
    DEBUG: 3,
    SILLY: 4,
};

export const ERROR = LEVELS.ERROR;
export const WARNING = LEVELS.WARNING;
export const INFO = LEVELS.INFO;
export const DEBUG = LEVELS.DEBUG;
export const SILLY = LEVELS.SILLY;

export default Logger;


let logLevel = process.env.LOGLEVEL || WARNING;


function setLevel(level) {
    if (level < ERROR) {
        level = ERROR;
    } else if (level > DEBUG) {
        level = DEBUG;
    }

    logLevel = level;
}

function error(...args) {
    _logMessage(ERROR, args[0], args.slice(1));
}

function warning(...args) {
    _logMessage(WARNING, args[0], args.slice(1));
}

function info(...args) {
    _logMessage(INFO, args[0], args.slice(1));
}

function debug(...args) {
    _logMessage(DEBUG, args[0], args.slice(1));
}

function silly(...args) {
    _logMessage(SILLY, args[0], args.slice(1));
}

function _logMessage(level, message, args) {
    if (level > logLevel) return;

    const out = [];
    for (let key in LEVELS) {
        if (LEVELS[key] === level) {
            out.push(key);
            break;
        }
    }

    out.push(
        message.replace(
            /{(\d+)}/g,
            (match, number) => typeof args[number]
            != 'undefined' ? args[number] : match
        )
    );

    console.log(out.join('::'));
}
