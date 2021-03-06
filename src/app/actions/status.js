import * as types from '../constants/ActionTypes';
const startKeys = {
  'loading': 'Loading',
  'decoding': 'Decoding'
};
const endKeys = {
  'loading': 'Loaded',
  'decoding': 'Decoded'
};

export function initStatus() {
  return {
    type: types.INIT_STATUS
  };
}

export function setStatusValid(isValid = false) {
  return {
    type: types.SET_STATUS_VALID,
    isValid: isValid
  };
}

export function setStatusMessage(message = '') {
  return {
    type: types.SET_STATUS_MESSAGE,
    message: message
  };
}

export function start(key) {
  return (dispatch, getState) => {
    const { name } = getState();
    const action = { type: types.SET_STATUS };
    const currentTime = Date.now();
    action[`${key}Start`] = currentTime;
    action[`${key}End`] = currentTime;
    action[key] = true;
    dispatch(action);
    dispatch(setStatusMessage(`${startKeys[key]} "${name}".`));
  };
}

export function end(key, isFinished = true) {
  return (dispatch, getState) => {
    const { name } = getState();
    const action = { type: types.SET_STATUS };
    let statusVerb = startKeys[key];
    action[`${key}End`] = Date.now();
    if (isFinished) {
      action[key] = false;
      statusVerb = endKeys[key];
    }
    dispatch(action);
    dispatch(setStatusMessage(`${statusVerb} "${name}".`));
  };
}
