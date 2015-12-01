import * as types from '../constants/ActionTypes';

export function setSampleRate(value) {
  return {
    type: types.SET_SAMPLE_RATE,
    value: value
  };
}

export function setSampleRateFromContext() {
  return (dispatch, getState) => {
    const { audioContext } = getState();
    dispatch(setSampleRate(audioContext.sampleRate));
  };
}
