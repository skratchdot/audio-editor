import * as types from '../constants/ActionTypes';
import path from 'path';
import { setName } from './name';
import { getInitialStatsWaveform } from './statsWaveform';
import { setPlaybackPosition } from './playbackPosition';
import { setValidFile } from './validFile';
import { zoomShowAll } from './zoom';

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

export function handleBuffer(buffer, name) {
  return (dispatch) => {
    dispatch(setBuffer(buffer));
    if (buffer.length) {
      dispatch(getInitialStatsWaveform(buffer));
    }
    dispatch(setName(name));
    dispatch(setPlaybackPosition(0, 'actions/buffer'));
    dispatch(zoomShowAll());
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
