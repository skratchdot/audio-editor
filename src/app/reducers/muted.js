import * as types from '../constants/ActionTypes';

export default function (state = false, action) {
  switch (action.type) {
    case types.SET_MUTED:
      return action.value ? true : false;
    default:
      return state;
  }
}
