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

export function thisRoute(pageLocation) {
  let path = '/repos';
  let parts = [
    {key: 'repoId', routePart: `/${pageLocation.repoId}`},
    {key: 'buildId', routePart: `/${pageLocation.buildId}`},
    {key: 'packageId', routePart: `/${pageLocation.packageId}`}
  ];

  for (let p of parts) {
    if (pageLocation[p.key]) {
      path = path + p.routePart;
    } else {
      break;
    }
  }

  return path;
}

export function makeLinkTo(pageLocation, path) {
  switch(path.charAt(0)) {
  case '/': return path.substring(1);
  case '-': return thisRoute(pageLocation) + '/' + path.substring(2);
  default: return path;
  }
}

export function sliceAtNth(haystack, needle, count) {
  let index = 0;
  let cnt = count - 1;
  for (; cnt > 0; cnt--) {
    index = haystack.indexOf(needle, index + 1);
    if (index === -1) {
      index = haystack.length;
    }
  }
  return haystack.substring(0, index);
}
