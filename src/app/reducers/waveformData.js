import * as types from '../constants/ActionTypes';
import getDefaultData from '../defaults/waveformData';

export default function (state = getDefaultData(), action) {
  switch (action.type) {
    case types.SET_WAVEFORM_DATA:
      const newData = {};
      Object.keys(getDefaultData()).forEach(function (key) {
        if (action.hasOwnProperty(key)) {
          newData[key] = action[key];
        }
      });
      return newData;
    default:
      return state;
  }
}
