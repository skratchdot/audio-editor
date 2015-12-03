import * as types from '../constants/ActionTypes';
import path from 'path';
import { setName } from './name';
import { setWaveformData } from './waveformData';
const WaveformDataWorker = require('worker?inline!../workers/waveformData.js');
const workers = {};

const decodeAudioData = function (dispatch, getState, name, data, throwError) {
  const { audioContext, waveformData } = getState();
  const startWorker = function (key, buffer, validFile) {
    if (workers[key]) {
      workers[key].terminate();
      workers[key] = null;
    }
    workers[key] = new WaveformDataWorker();
    workers[key].onmessage = function (e) {
      e.data.validFile = validFile;
      dispatch(setWaveformData(key, e.data));
    };
    workers[key].postMessage({
      size: waveformData[key].size,
      buffer: validFile ? buffer.getChannelData(0) : new Float32Array()
    });
  };
  const handleBuffer = function (buffer, validFile) {
    dispatch(setBuffer(buffer));
    dispatch(setName(name));
    startWorker('zoom', buffer, validFile);
    startWorker('overview', buffer, validFile);
  };
  audioContext.decodeAudioData(data, (buffer) => {
    handleBuffer(buffer, true);
  }, (err) => {
    handleBuffer([], false);
    if (throwError) {
      throw err;
    }
  });
};

export function setBuffer(value = new Float32Array()) {
  return {
    type: types.SET_BUFFER,
    value: value
  };
}

export function setBufferFromUrl(url = '') {
  return (dispatch, getState) => {
    const request = new XMLHttpRequest();
    const name = path.basename(url);
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function () {
      decodeAudioData(dispatch, getState, name, request.response, true);
		};
    decodeAudioData(dispatch, getState, name, new ArrayBuffer(), false);
		request.send();
  };
}

export function setBufferFromFile(file) {
  return (dispatch, getState) => {
    const reader = new FileReader();
		reader.onload = function () {
      decodeAudioData(dispatch, getState, file.name, reader.result, true);
    };
    decodeAudioData(dispatch, getState, file.name, new ArrayBuffer(), false);
    reader.readAsArrayBuffer(file);
  };
}
