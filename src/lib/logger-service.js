require('./env-vars')
  .config();

const Logger = {
  setLevel,
  getLevel,

  log,
  error,
  warning,
  info,
  debug,
  silly,
};

export const LEVELS = {
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

let logLevel = process.env.LOGLEVEL || INFO;

function setLevel(level) {
  if (level < ERROR) {
    level = ERROR;
  } else if (level > SILLY) {
    level = SILLY;
  }

  logLevel = level;
}

function getLevel() {
  return logLevel;
}

function log(level, ...args) {
  _logMessage(level, args[0], args.slice(1));
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
  const out = [];

  if (level > logLevel) {
    return;
  }

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
