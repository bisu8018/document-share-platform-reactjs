const logger = store => next => action => {
  console.group(action.type);
  console.log('before state', store.getState());
  console.info('dispatch', action);
  next(action);
  console.log('next state', store.getState());
  console.groupEnd(action.type);
};

export default logger