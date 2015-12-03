import * as types from '../constants/ActionTypes';

export function setPlaybackPosition(value = 0) {
  return {
    type: types.SET_PLAYBACK_POSITION,
    value: value
  };
}
