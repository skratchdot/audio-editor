import * as types from '../constants/ActionTypes';

export function setMuted(value = false) {
  return {
    type: types.SET_MUTED,
    value: value
  };
}

export function toggleMuted() {
  return (dispatch, getState) => {
    const { muted } = getState();
    dispatch(setMuted(!muted));
  };
}
