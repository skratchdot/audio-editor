import * as types from '../constants/ActionTypes';
import getDefaultData, { getWaveformDataSchema } from '../defaults/waveformData';

export default function (state = getDefaultData(), action) {
  switch (action.type) {
    case types.SET_WAVEFORM_DATA:
      let isInvalid = false;
      ['key', 'data'].forEach(function (key) {
        if (!action.hasOwnProperty(key)) {
          isInvalid = true;
        }
      });
      if (isInvalid) {
        return state;
      }
      const newData = {};
      const inputData = action.data;
      newData[action.key] = {};
      Object.keys(getWaveformDataSchema()).forEach(function (key) {
        if (inputData.hasOwnProperty(key)) {
          newData[action.key][key] = inputData[key];
        }
      });
      return Object.assign({}, state, newData);
    default:
      return state;
  }
}
