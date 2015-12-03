import * as types from '../constants/ActionTypes';

export default function (state = 0, action) {
  switch (action.type) {
    case types.SET_PLAYBACK_POSITION:
      let position = parseFloat(action.value);
      position = Number.isFinite(position) ? position : 0;
      return position;
    default:
      return state;
  }
}
