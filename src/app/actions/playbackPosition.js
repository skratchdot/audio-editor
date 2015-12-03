import * as types from '../constants/ActionTypes';

export function setPlaybackPosition(position = 0, source) {
  return {
    type: types.SET_PLAYBACK_POSITION,
    position: position,
    source: source
  };
}
