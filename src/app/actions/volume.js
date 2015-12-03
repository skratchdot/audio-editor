import * as types from '../constants/ActionTypes';

export function setVolume(value = 1) {
  return {
    type: types.SET_VOLUME,
    value: value
  };
}
