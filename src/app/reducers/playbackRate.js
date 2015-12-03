import * as types from '../constants/ActionTypes';

export default function (state = 1, action) {
  switch (action.type) {
    case types.SET_PLAYBACK_RATE:
      let playbackRate = parseFloat(action.value);
      playbackRate = Number.isFinite(playbackRate) ? playbackRate : 1;
      return playbackRate;
    default:
      return state;
  }
}
