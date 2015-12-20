import * as types from '../constants/ActionTypes';
import path from 'path';
import { setName } from './name';
import { getInitialStatsWaveform } from './statsWaveform';
import { setPlaybackPosition } from './playbackPosition';
import { initStatus, setStatusMessage, setStatusValid, start, end } from './status';
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
      dispatch(end('loading'));
      dispatch(decodeAudioData(request.response, true));
		};
    dispatch(setBuffer());
    dispatch(setName(name));
    dispatch(start('loading'));
    dispatch(setStatusValid(false));
		request.send();
  };
}

export function setBufferFromFile(file) {
  return (dispatch) => {
    const reader = new FileReader();
		reader.onload = function () {
      dispatch(end('loading'));
      dispatch(decodeAudioData(reader.result, true));
    };
    dispatch(setBuffer());
    dispatch(setName(file.name));
    dispatch(start('loading'));
    dispatch(setStatusValid(false));
    reader.readAsArrayBuffer(file);
  };
}

export function handleBuffer(buffer) {
  return (dispatch) => {
    dispatch(setBuffer(buffer));
    if (buffer.length) {
      dispatch(getInitialStatsWaveform(buffer));
    }
    dispatch(setPlaybackPosition(0, 'actions/buffer'));
    dispatch(zoomShowAll());
  };
}

export function decodeAudioData(data, throwError) {
  return (dispatch, getState) => {
    const { audioContext, name } = getState();
    dispatch(start('decoding'));
    audioContext.decodeAudioData(data, (buffer) => {
      dispatch(end('decoding'));
      dispatch(handleBuffer(buffer));
      dispatch(setStatusMessage(`Decoded "${name}" successfully.`));
      dispatch(setStatusValid(true));
    }, function () {
      dispatch(end('decoding'));
      dispatch(handleBuffer([]));
      if (throwError) {
        dispatch(setStatusValid(false));
        dispatch(setStatusMessage(`Could not decode "${name}".`));
      } else {
        dispatch(initStatus());
      }
    });
  };
}
