import * as types from '../constants/ActionTypes';

export default function (state = new AudioContext(), action) {
  switch (action.type) {
    case types.SET_AUDIO_CONTEXT:
      return action.value;
    default:
      return state;
  }
}
