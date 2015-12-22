import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import audioContext from './audioContext';
import buffer from './buffer';
import examples from './examples';
import mono from './mono';
import muted from './muted';
import name from './name';
import playbackPosition from './playbackPosition';
import playbackRate from './playbackRate';
import playbackScrubbing from './playbackScrubbing';
import playbackType from './playbackType';
import statsWaveform from './statsWaveform';
import status from './status';
import volume from './volume';
import zoom from './zoom';

const rootReducer = combineReducers({
  router: routerStateReducer,
  audioContext,
  buffer,
  examples,
  mono,
  muted,
  name,
  playbackPosition,
  playbackRate,
  playbackScrubbing,
  playbackType,
  statsWaveform,
  status,
  volume,
  zoom
});

export default rootReducer;
