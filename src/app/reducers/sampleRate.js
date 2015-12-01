import * as types from '../constants/ActionTypes';

export default function (state = 0, action) {
  switch (action.type) {
    case types.SET_SAMPLE_RATE:
      return action.value;
    default:
      return state;
  }
}
