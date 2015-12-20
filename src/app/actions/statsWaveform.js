import * as types from '../constants/ActionTypes';
import OneWorker from '../helpers/OneWorker';
import StatsWaveformWorker from 'worker?inline!../workers/statsWaveform.js';
const workers = {};

function terminateWorker(key) {
  if (workers[key]) {
    workers[key].terminate();
    workers[key] = null;
  }
}

function terminateWorkers() {
  Object.keys(workers).forEach(function (key) {
    terminateWorker(key);
  });
}

export function initStatsWaveform() {
  return {
    type: types.INIT_STATS_WAVEFORM
  };
}

export function getInitialStatsWaveform(audio) {
  terminateWorkers();
  return (dispatch) => {
    const channels = [];
    for (let i = 0; i < audio.numberOfChannels; i++) {
      channels.push(audio.getChannelData(i));
    }
    dispatch(initStatsWaveform());
    [
      [1, 100]
      /*
      , [2, 0]
      , [3, 0]
      , [4, 0]
      , [5, 0]
      */
    ].forEach(function (data) {
      const [ zoomLevel, forceEmitTime ] = data;
      dispatch(startWorker(audio, channels, zoomLevel, forceEmitTime));
    });
  };
}

export function startWorker(audio, channels, zoomLevel, forceEmitTime) {
  const token = Date.now();
  return (dispatch) => {
    terminateWorker(zoomLevel);
    workers[zoomLevel] = new OneWorker(StatsWaveformWorker);
    console.log('startingWorker:', token, `${Date.now() - token}ms`);
    workers[zoomLevel].exec({
      token: token,
      zoomLevel: zoomLevel,
      start: 0,
      end: audio.length,
      channels: channels,
      bucketSize: 1024,
      forceEmitTime: forceEmitTime
    }, function (e, worker) {
      if (e.data.token === token) {
        if (e.data.type === 'terminate') {
          worker.terminate();
        } else {
          e.data.type = types.UPDATE_STATS_WAVEFORM;
          dispatch(e.data);
        }
      }
    }, function (err) {
      /*eslint-disable*/
      console.error('statsWaveform: onerror:', Date.now(), err);
      /*eslint-enable*/
    });
  };
}
