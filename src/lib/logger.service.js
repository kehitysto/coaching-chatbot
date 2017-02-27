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
  SILLY: 4
};

export const ERROR = LEVELS.ERROR;
export const WARNING = LEVELS.WARNING;
export const INFO = LEVELS.INFO;
export const DEBUG = LEVELS.DEBUG;
export const SILLY = LEVELS.SILLY;

export default Logger;

var logLevel = process.env.LOGLEVEL || WARNING;

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

function log() {
  const args = Array.prototype.slice.apply(arguments);
  _logMessage(logLevel, args[0], args.slice(1));
}

function error() {
  const args = Array.prototype.slice.apply(arguments);
  _logMessage(ERROR, args[0], args.slice(1));
}

function warning() {
  const args = Array.prototype.slice.apply(arguments);
  _logMessage(WARNING, args[0], args.slice(1));
}

function info() {
  const args = Array.prototype.slice.apply(arguments);
  _logMessage(INFO, args[0], args.slice(1));
}

function debug() {
  const args = Array.prototype.slice.apply(arguments);
  _logMessage(DEBUG, args[0], args.slice(1));
}

function silly() {
  const args = Array.prototype.slice.apply(arguments);
  _logMessage(SILLY, args[0], args.slice(1));
}

function _logMessage(level, message, args) {
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
      (match, number) => typeof args[number] != 'undefined' ? args[number] :
      match
    )
  );

  console.log(out.join('::'));
}
