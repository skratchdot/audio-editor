import * as types from '../constants/ActionTypes';
import { getRandomFile, getRandomGroup } from '../components/ExampleFileSelector';
import { setBufferFromUrl } from '../actions/buffer';

export function setExamples(group = '', file = '') {
  return {
    type: types.SET_EXAMPLES,
    group: group,
    file: file
  };
}

export function loadExampleFile(exampleFile) {
  return (dispatch) => {
    const urlPrefix = 'http://projects.skratchdot.com/audio-files';
    const url = `${urlPrefix}${exampleFile}`;
    dispatch(setBufferFromUrl(url));
  };
}

export function setRandomGroupAndFile(load = true) {
  return (dispatch) => {
    const group = getRandomGroup();
    const groupKey = group.key;
    const file = getRandomFile(groupKey)[0];
    dispatch(setExamples(groupKey, file));
    if (load) {
      dispatch(loadExampleFile(file));
    }
  };
}

export function setRandomFile(load = true) {
  return (dispatch, getState) => {
    const { examples } = getState();
    const file = getRandomFile(examples.group)[0];
    dispatch(setExamples(examples.group, file));
    if (load) {
      dispatch(loadExampleFile(file));
    }
  };
}
