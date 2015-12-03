import * as types from '../constants/ActionTypes';

export default function (state = 0, action) {
  switch (action.type) {
    case types.SET_PLAYBACK_TYPE:
      let type = parseFloat(action.value);
      if (type > 0) {
        type = 1;
      } else if (type < 0) {
        type = -1;
      } else {
        type = 0;
      }
      return type;
    default:
      return state;
  }
}
