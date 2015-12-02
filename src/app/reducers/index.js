import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import audioContext from './audioContext';
import buffer from './buffer';
import name from './name';
import sampleRate from './sampleRate';
import waveformData from './waveformData';

const rootReducer = combineReducers({
  router: routerStateReducer,
  audioContext,
  buffer,
  name,
  sampleRate,
  waveformData
});

export default rootReducer;
