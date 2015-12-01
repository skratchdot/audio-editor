import * as types from '../constants/ActionTypes';

export function setName(value = '') {
  return {
    type: types.SET_NAME,
    value: value
  };
}
