import * as types from '../constants/ActionTypes';
import path from 'path';
import { setName } from './name';
import { setWaveformData } from './waveformData';
const WaveformDataWorker = require('worker?inline!../workers/waveformData.js');
let waveformDataWorker;

const decodeAudioData = function (dispatch, getState, name, data) {
  const { audioContext, waveformData } = getState();
  audioContext.decodeAudioData(data, (buffer) => {
    dispatch(setBuffer(buffer));
    dispatch(setName(name));
    if (waveformDataWorker) {
      waveformDataWorker.terminate();
      waveformDataWorker = null;
    }
    waveformDataWorker = new WaveformDataWorker();
    waveformDataWorker.onmessage = function (e) {
      dispatch(setWaveformData(e.data));
    };
    waveformDataWorker.postMessage({
      size: waveformData.size,
      buffer: buffer.getChannelData(0)
    });
  }, (err) => {
    throw err;
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
      decodeAudioData(dispatch, getState, name, request.response);
		};
		request.send();
  };
}

export function setBufferFromFile(file) {
  return (dispatch, getState) => {
    const reader = new FileReader();
		reader.onload = function () {
      decodeAudioData(dispatch, getState, file.name, reader.result);
    };
    reader.readAsArrayBuffer(file);
  };
}
