import * as types from '../constants/ActionTypes';

export default function (state = { start: 0, end: 0 }, action) {
  switch (action.type) {
    case types.SET_ZOOM:
      return Object.assign({}, state, {
        start: action.start,
        end: action.end
      });
    default:
      return state;
  }
}
