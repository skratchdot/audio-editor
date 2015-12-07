import * as types from '../constants/ActionTypes';
import { getRandomFile, getRandomGroup } from '../components/ExampleFileSelector';
import { setBufferFromUrl } from '../actions/buffer';
import { pushState } from 'redux-router';

export function setExamples(group = '', file = '') {
  return (dispatch) => {
    const examplesUrl = '/audio-editor/editor/examples/';
    let fileName = (file || '').split('/');
    fileName = fileName[fileName.length - 1].split('.')[0];
    dispatch({
      type: types.SET_EXAMPLES,
      group: group,
      file: file
    });
    dispatch(pushState(null, `${examplesUrl}${group}/${fileName}`));
  };
}

export function loadExampleFile(group, file) {
  return (dispatch) => {
    const urlPrefix = 'http://projects.skratchdot.com/audio-files';
    const url = `${urlPrefix}${file}`;
    dispatch(setExamples(group, file));
    if (typeof file === 'string' && file.length) {
      dispatch(setBufferFromUrl(url));
    }
  };
}

export function setRandomGroupAndFile() {
  return (dispatch) => {
    const group = getRandomGroup();
    const groupKey = group.key;
    const file = getRandomFile(groupKey)[0];
    dispatch(loadExampleFile(groupKey, file));
  };
}

export function setRandomFile() {
  return (dispatch, getState) => {
    const { examples } = getState();
    const file = getRandomFile(examples.group)[0];
    dispatch(loadExampleFile(examples.group, file));
  };
}
