import * as types from '../constants/ActionTypes';

export function setAudioContext(value = new AudioContext()) {
  return {
    type: types.SET_AUDIO_CONTEXT,
    value: value
  };
}
