export let log =  function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};

export let err =  function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(console){
    console.error( Array.prototype.slice.call(arguments) );
  }
};

export let warn =  function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(console){
    console.warn( Array.prototype.slice.call(arguments) );
  }
};
