export let log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};

export let err = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(console){
    console.error( Array.prototype.slice.call(arguments) );
  }
};

export let warn = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(console){
    console.warn( Array.prototype.slice.call(arguments) );
  }
};

export function tryPath(obj, args) {
  if (args.length === 0) {
    return obj
  } else if (
      obj === null || 
      obj === undefined ||
      ! obj.hasOwnProperty(args[0])
    ) {
    return null
  }
  return tryPath(obj[args[0]], args.slice(1))
}