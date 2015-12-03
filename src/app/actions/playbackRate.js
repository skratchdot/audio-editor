import * as types from '../constants/ActionTypes';

export function setPlaybackRate(value = 1) {
  return {
    type: types.SET_PLAYBACK_RATE,
    value: value
  };
}
