import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import audioContext from './audioContext';
import buffer from './buffer';
import name from './name';
import playbackRate from './playbackRate';
import playbackType from './playbackType';
import volume from './volume';
import waveformData from './waveformData';

const rootReducer = combineReducers({
  router: routerStateReducer,
  audioContext,
  buffer,
  name,
  playbackRate,
  playbackType,
  volume,
  waveformData
});

export default rootReducer;
