import * as types from '../constants/ActionTypes';
import { startWorker } from './buffer';

export function setZoom(start, end) {
  return (dispatch) => {
    start = parseFloat(start);
    end = parseFloat(end);
    if (end < start) {
      [start, end] = [end, start];
    }
    start = Math.max(0, start);
    end = Math.max(start, end);
    const length = end - start;
    dispatch({
      type: types.SET_ZOOM,
      start: start,
      end: end,
      length: length
    });
    dispatch(startWorker('zoom'));
  };
}

export function zoomIn() {
  return (dispatch, getState) => {
    const { zoom } = getState();
    const newLength = zoom.length / 2;
    let newEnd = zoom.start + newLength;
    newEnd = Math.max(zoom.start + 1, newEnd);
    dispatch(setZoom(zoom.start, newEnd));
  };
}

export function zoomOut() {
  return (dispatch, getState) => {
    const { buffer, zoom } = getState();
    const newLength = zoom.length * 2;
    let newStart = zoom.start;
    let newEnd = newStart + newLength;
    if (newEnd > buffer.length) {
      newEnd = buffer.length;
      newStart = newEnd - newLength;
    }
    newEnd = Math.min(newEnd, buffer.length || 0);
    newStart = Math.max(newStart, 0);
    dispatch(setZoom(newStart, newEnd));
  };
}

export function zoomShowAll() {
  return (dispatch, getState) => {
    const { buffer } = getState();
    dispatch(setZoom(0, buffer.length || 0));
  };
}

export function zoomMoveCenter(ratio) {
  return (dispatch, getState) => {
    const { buffer, zoom } = getState();
    const bufferLength = buffer.length;
    const zoomLength = zoom.end - zoom.start;
    const halfLength = Math.round(zoomLength / 2);
    const centerPoint = bufferLength * ratio;
    const maxStart = bufferLength - zoomLength;
    const guessStart = centerPoint - halfLength;
    let start = guessStart;
    start = Math.min(start, maxStart);
    start = Math.max(0, start);
    const end = start + zoomLength;
    /*
    console.log('center:',
      'ratio', ratio,
      'bufferLength', bufferLength,
      'zoomLength', zoomLength,
      'halfLength', halfLength,
      'centerPoint', centerPoint,
      'maxStart', maxStart,
      'guessStart', guessStart,
      'start', start,
      'end', end
    );
    */
    dispatch(setZoom(start, end));
  };
}

export function setZoomEdit(isEditing, editType) {
  return (dispatch) => {
    dispatch({
      type: types.SET_ZOOM_EDIT,
      isEditing: isEditing,
      editType: editType
    });
  };
}

export function toggleZoomPanel() {
  return (dispatch, getState) => {
    const { zoom } = getState();
    dispatch({
      type: types.SET_ZOOM_PANEL_EXPANDED,
      zoomPanelExpanded: !zoom.zoomPanelExpanded
    });
  };
}
