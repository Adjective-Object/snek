/* eslint-disable no-console*/
export let log = function () {
  // store logs to an array for reference
  log.history = log.history || [];
  log.history.push(arguments);
  if(console) {
    console.log(Array.prototype.slice.call(arguments));
  }
};

export let err = function () {
  // store logs to an array for reference
  log.history = log.history || [];
  log.history.push(arguments);
  if(console) {
    console.error(Array.prototype.slice.call(arguments));
  }
};

export let warn = function () {
  // store logs to an array for reference
  log.history = log.history || [];
  log.history.push(arguments);
  if(console) {
    console.warn(Array.prototype.slice.call(arguments));
  }
};
/* eslint-enable no-console*/

export function tryPath(obj, args) {
  if (args.length === 0) {
    return obj;
  } else if (
      !obj ||
      !obj.hasOwnProperty(args[0])
    ) {
    return null;
  }
  return tryPath(obj[args[0]], args.slice(1));
}
