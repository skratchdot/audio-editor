import * as types from '../constants/ActionTypes';

function getDefaultData() {
  return {
    isValid: false,
    message: 'No File Loaded.',
    // loading
    loading: false,
    loadingStart: null,
    loadingEnd: null,
    // decoding
    decoding: false,
    decodingStart: null,
    decodingEnd: null
  };
}

export default function (state = getDefaultData(), action) {
  switch (action.type) {
    case types.INIT_STATUS:
      return getDefaultData();
    case types.SET_STATUS:
      delete action.type;
      return Object.assign({}, state, action);
    case types.SET_STATUS_VALID:
      return Object.assign({}, state, { isValid: action.isValid });
    case types.SET_STATUS_MESSAGE:
      return Object.assign({}, state, { message: action.message });
    default:
      return state;
  }
}
