import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import audioContext from './audioContext';
import buffer from './buffer';
import name from './name';
import playbackPosition from './playbackPosition';
import playbackRate from './playbackRate';
import playbackType from './playbackType';
import volume from './volume';
import waveformData from './waveformData';

const rootReducer = combineReducers({
  router: routerStateReducer,
  audioContext,
  buffer,
  name,
  playbackPosition,
  playbackRate,
  playbackType,
  volume,
  waveformData
});

export default rootReducer;
