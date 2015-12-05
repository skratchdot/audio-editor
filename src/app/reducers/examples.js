import * as types from '../constants/ActionTypes';

export default function (state = { group: null, file: null }, action) {
  switch (action.type) {
    case types.SET_EXAMPLES:
      return Object.assign({}, state, {
        group: action.group,
        file: action.file
      });
    default:
      return state;
  }
}
