import * as types from '../constants/ActionTypes';

export default function (state = false, action) {
  switch (action.type) {
    case types.SET_PLAYBACK_SCRUBBING:
      return action.isScrubbing || false;
    default:
      return state;
  }
}
