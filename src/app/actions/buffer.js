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
    const { buffer, waveformData, zoom } = getState();
    if (workers[key]) {
      workers[key].terminate();
      workers[key] = null;
    }
    workers[key] = new WaveformDataWorker();
    workers[key].onmessage = function (e) {
      dispatch(setWaveformData(key, e.data));
    };
    const postData = {};
    postData.size = waveformData[key].size;
    if (buffer && buffer.length) {
      postData.buffer = buffer.getChannelData(0);
    } else {
      postData.buffer = new Float32Array();
    }
    if (key === 'zoom') {
      postData.start = zoom.start;
      postData.end = zoom.end;
    } else {
      postData.start = 0;
      postData.end = postData.buffer.length;
    }
    workers[key].postMessage(postData);
  };
}

export function handleBuffer(buffer, name) {
  return (dispatch) => {
    dispatch(setBuffer(buffer));
    dispatch(setName(name));
    dispatch(setPlaybackPosition(0, 'actions/buffer'));
    dispatch(zoomShowAll());
    dispatch(startWorker('overview'));
  };
}

export function decodeAudioData(name, data, throwError) {
  return (dispatch, getState) => {
    const { audioContext } = getState();
    audioContext.decodeAudioData(data, (buffer) => {
      dispatch(handleBuffer(buffer, name));
      dispatch(setValidFile(true, ''));
    }, function () {
      dispatch(handleBuffer([], name));
      if (throwError) {
        dispatch(setValidFile(false, `Could not decode ${name}.`));
      } else {
        dispatch(setValidFile(false, ''));
      }
    });
  };
}
