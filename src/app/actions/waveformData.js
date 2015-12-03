import * as types from '../constants/ActionTypes';

export function setWaveformData(key, data) {
  const action = {};
  action.key = key;
  action.data = Object.assign({}, data);
  action.type = types.SET_WAVEFORM_DATA;
  return action;
}
