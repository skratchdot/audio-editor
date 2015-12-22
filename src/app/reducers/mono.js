import * as types from '../constants/ActionTypes';

export default function (state = false, action) {
  switch (action.type) {
    case types.SET_MONO:
      return action.value ? true : false;
    default:
      return state;
  }
}
