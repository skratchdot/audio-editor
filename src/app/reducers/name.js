import * as types from '../constants/ActionTypes';

export default function (state = '', action) {
  switch (action.type) {
    case types.SET_NAME:
      return action.value;
    default:
      return state;
  }
}
