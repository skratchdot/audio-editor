import * as types from '../constants/ActionTypes';

export function setMono(value = false) {
  return {
    type: types.SET_MONO,
    value: value
  };
}
