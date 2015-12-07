import * as types from '../constants/ActionTypes';

export function setPlaybackScrubbing(isScrubbing = false) {
  return {
    type: types.SET_PLAYBACK_SCRUBBING,
    isScrubbing: isScrubbing
  };
}
