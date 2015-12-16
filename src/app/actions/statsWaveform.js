import * as types from '../constants/ActionTypes';
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

function initWorker(key, onmessage, onerror, messages) {
  let worker;
  terminateWorker(key);
  worker = new StatsWaveformWorker();
  if (typeof onmessage === 'function') {
    worker.onmessage = onmessage;
  }
  if (typeof onerror === 'function') {
    worker.onerror = onerror;
  }
  if (Array.isArray(messages)) {
    messages.forEach(function (message) {
      worker.postMessage(message);
    });
  } else if (typeof messages === 'object') {
    worker.postMessage(messages);
  }
}

export function initStatsWaveform() {
  return {
    type: types.INIT_STATS_WAVEFORM
  };
}

export function getInitialStatsWaveform(audio) {
  const token = Date.now();
  return (dispatch) => {
    const channels = [];
    for (let i = 0; i < audio.numberOfChannels; i++) {
      channels.push(audio.getChannelData(i));
    }
    const postMessage = {
      token: token,
      forceRender: false,
      channels: channels,
      start: 0,
      end: audio.length
    };
    const onMessage = function (e) {
      if (e.data.token === token) {
        const action = Object.assign({}, e.data, {
          type: types.UPDATE_STATS_WAVEFORM
        });
        dispatch(action);
        if (e.data.isFinished) {
          terminateWorker(e.data.key);
        }
      }
    };
    const onError = function (key, err) {
      /*eslint-disable */
      console.error(err);
      /*eslint-enable */
      terminateWorker(key);
    };
    dispatch(initStatsWaveform());
    terminateWorkers();
    initWorker(1, onMessage, onError.bind(this, 1), Object.assign({}, postMessage, {
      key: 1,
      bucketSize: 1
    }));
    for (let i = 10; i < 11; i++) {
      const key = Math.pow(2, i);
      initWorker(key, onMessage, onError.bind(this, key), Object.assign({}, postMessage, {
        key: key,
        bucketSize: key,
        forceRender: key === 1024 ? true : false
      }));
    }
  };
}
