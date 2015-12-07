import * as types from '../constants/ActionTypes';

export default function (state = {
  position: 0,
  source: null
}, action) {
  switch (action.type) {
    case types.SET_PLAYBACK_POSITION:
      let position = parseFloat(action.position);
      position = Number.isFinite(position) ? position : 0;
      return Object.assign({}, state, {
        position: position,
        source: action.source
      });
    default:
      return state;
  }
}
