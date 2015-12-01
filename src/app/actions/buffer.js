import * as types from '../constants/ActionTypes';
import path from 'path';
import { setName } from './name';

const decodeAudioData = function (dispatch, audioContext, name, data) {
  audioContext.decodeAudioData(data).then((buffer) => {
    dispatch(setBuffer(buffer));
    dispatch(setName(name));
  }).catch((err) => {
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
    const { audioContext } = getState();
    const request = new XMLHttpRequest();
    const name = path.basename(url);
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function () {
      decodeAudioData(dispatch, audioContext, name, request.response);
		};
		request.send();
  };
}

export function setBufferFromFile(file) {
  return (dispatch, getState) => {
    const { audioContext } = getState();
    const reader = new FileReader();
		reader.onload = function () {
      decodeAudioData(dispatch, audioContext, file.name, reader.result);
    };
    reader.readAsArrayBuffer(file);
  };
}
