import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import audioContext from './audioContext';
import buffer from './buffer';
import examples from './examples';
import name from './name';
import playbackPosition from './playbackPosition';
import playbackRate from './playbackRate';
import playbackScrubbing from './playbackScrubbing';
import playbackType from './playbackType';
import volume from './volume';
import waveformData from './waveformData';
import validFile from './validFile';
import zoom from './zoom';

const rootReducer = combineReducers({
  router: routerStateReducer,
  audioContext,
  buffer,
  examples,
  name,
  playbackPosition,
  playbackRate,
  playbackScrubbing,
  playbackType,
  validFile,
  volume,
  waveformData,
  zoom
});

export default rootReducer;
