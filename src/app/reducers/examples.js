import * as types from '../constants/ActionTypes';
import { getRandomFile, getRandomGroup } from '../components/ExampleFileSelector';

function getDefaultState() {
  const group = getRandomGroup();
  return {
    group: group.key,
    file: getRandomFile(group.key)[0]
  };
}

export default function (state = getDefaultState(), action) {
  switch (action.type) {
    case types.SET_EXAMPLES:
      return Object.assign({}, state, {
        group: action.group,
        file: action.file
      });
    default:
      return state;
  }
}
