import * as types from '../constants/ActionTypes';

/*
 * statsWaveform is an array of objects containing the following properties:
 *   - dataType
 *   - zoomLevel
 *   - start
 *   - end
 *   - channels
 *   - mono
 */
export default function (state = [], action) {
  switch (action.type) {
    case types.INIT_STATS_WAVEFORM:
      return [];
    case types.UPDATE_STATS_WAVEFORM:
      const newState = [];
      delete action.type;
      newState.push(action); // new updates go in front
      for (let i = 0; i < state.length; i++) {
        const item = state[i];
        let shouldAdd = false;
        ['zoomLevel', 'start', 'end'].forEach(function (key) {
          if (item[key] !== action[key]) {
            shouldAdd = true;
          }
        });
        if (shouldAdd) {
          newState.push(Object.assign({}, item));
        }
      }
      return newState;
    default:
      return state;
  }
}
