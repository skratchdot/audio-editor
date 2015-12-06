import * as types from '../constants/ActionTypes';
import path from 'path';
import { setName } from './name';
import { setPlaybackPosition } from './playbackPosition';
import { setWaveformData } from './waveformData';
import { setValidFile } from './validFile';
import { zoomShowAll } from './zoom';
const WaveformDataWorker = require('worker?inline!../workers/waveformData.js');
const workers = {};

export function setBuffer(value = new Float32Array()) {
  return {
    type: types.SET_BUFFER,
    value: value
  };
}

export function setBufferFromUrl(url = '') {
  return (dispatch) => {
    const request = new XMLHttpRequest();
    const name = path.basename(url);
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function () {
      dispatch(decodeAudioData(name, request.response, true));
		};
    dispatch(decodeAudioData(name, new ArrayBuffer(), false));
		request.send();
  };
}

export function setBufferFromFile(file) {
  return (dispatch) => {
    const reader = new FileReader();
		reader.onload = function () {
      dispatch(decodeAudioData(file.name, reader.result, true));
    };
    dispatch(decodeAudioData(file.name, new ArrayBuffer(), false));
    reader.readAsArrayBuffer(file);
  };
}

export function startWorker(key) {
  return (dispatch, getState) => {
    const { buffer, waveformData } = getState();
    if (workers[key]) {
      workers[key].terminate();
      workers[key] = null;
    }
    workers[key] = new WaveformDataWorker();
    workers[key].onmessage = function (e) {
      dispatch(setWaveformData(key, e.data));
    };
    workers[key].postMessage({
      size: waveformData[key].size,
      buffer: buffer && buffer.length ? buffer.getChannelData(0) : new Float32Array()
    });
  };
}

export function decodeAudioData(name, data, throwError) {
  return (dispatch, getState) => {
    const { audioContext } = getState();
    const handleBuffer = function (buffer) {
      dispatch(setBuffer(buffer));
      dispatch(setName(name));
      dispatch(setPlaybackPosition(0, 'actions/buffer'));
      dispatch(zoomShowAll());
      dispatch(startWorker('zoom'));
      dispatch(startWorker('overview'));
    };
    audioContext.decodeAudioData(data, (buffer) => {
      handleBuffer(buffer);
      dispatch(setValidFile(true, ''));
    }, function () {
      handleBuffer([], false);
      if (throwError) {
        dispatch(setValidFile(false, `Could not decode ${name}.`));
      } else {
        dispatch(setValidFile(false, ''));
      }
    });
  };
}
