import * as types from '../constants/ActionTypes';

export default function (state = new Float32Array(), action) {
  switch (action.type) {
    case types.SET_BUFFER:
      return action.value;
    default:
      return state;
  }
}
