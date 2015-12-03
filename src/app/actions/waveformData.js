import * as types from '../constants/ActionTypes';

export function setWaveformData(key, data) {
  const action = {};
  action.key = key;
  action.data = JSON.parse(JSON.stringify(data));
  action.type = types.SET_WAVEFORM_DATA;
  return action;
}
