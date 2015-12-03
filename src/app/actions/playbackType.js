import * as types from '../constants/ActionTypes';

export function setPlaybackType(value = 0) {
  return {
    type: types.SET_PLAYBACK_TYPE,
    value: value
  };
}
