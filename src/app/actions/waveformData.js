import * as types from '../constants/ActionTypes';
import getDefaultData from '../defaults/waveformData';

export function setWaveformData(value = getDefaultData()) {
  const action = {};
  Object.keys(value).forEach(function (key) {
    action[key] = value[key];
  });
  action.type = types.SET_WAVEFORM_DATA;
  return action;
}
