import * as types from '../constants/ActionTypes';

function getDefaultData() {
  return {
    start: 0,
    end: 0,
    length: 0,
    isEditing: false,
    editType: ''
  };
}

export default function (state = getDefaultData(), action) {
  switch (action.type) {
    case types.SET_ZOOM:
      return Object.assign({}, state, {
        start: action.start,
        end: action.end,
        length: action.length
      });
    case types.SET_ZOOM_EDIT:
      return Object.assign({}, state, {
        isEditing: action.isEditing,
        editType: action.editType
      });
    default:
      return state;
  }
}
