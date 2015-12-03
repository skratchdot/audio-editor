import * as types from '../constants/ActionTypes';

export default function (state = 0.5, action) {
  switch (action.type) {
    case types.SET_VOLUME:
      let volume = parseFloat(action.value);
      volume = Number.isFinite(volume) ? volume : 0;
      volume = Math.min(volume, 1);
      volume = Math.max(volume, 0);
      return volume;
    default:
      return state;
  }
}
