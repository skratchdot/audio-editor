import * as types from '../constants/ActionTypes';

function getDefaultData() {
  return {
    isValid: false,
    message: ''
  };
}

export default function (state = getDefaultData(), action) {
  switch (action.type) {
    case types.SET_VALID_FILE:
      const newData = {};
      newData.isValid = action.isValid || false;
      newData.message = action.message;
      return Object.assign({}, state, newData);
    default:
      return state;
  }
}
