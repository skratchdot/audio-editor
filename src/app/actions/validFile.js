import * as types from '../constants/ActionTypes';

export function setValidFile(isValid = false, message = '') {
  return {
    type: types.SET_VALID_FILE,
    isValid: isValid,
    message: message
  };
}
