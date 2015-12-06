import * as types from '../constants/ActionTypes';
import { startWorker } from './buffer';

export function setZoom(start, end) {
  return (dispatch) => {
    dispatch({
      type: types.SET_ZOOM,
      start: start,
      end: end
    });
    dispatch(startWorker('zoom'));
  };
}

export function zoomIn() {
  return (dispatch, getState) => {
    const { zoom } = getState();
    let newEnd = zoom.end - zoom.start;
    newEnd /= 2;
    newEnd = Math.max(zoom.start + 1, newEnd);
    dispatch(setZoom(zoom.start, newEnd));
  };
}

export function zoomOut() {
  return (dispatch, getState) => {
    const { buffer, zoom } = getState();
    let newEnd = zoom.end - zoom.start;
    newEnd *= 2;
    newEnd = Math.min(newEnd, buffer.length || 0);
    dispatch(setZoom(zoom.start, newEnd));
  };
}

export function zoomShowAll() {
  return (dispatch, getState) => {
    const { buffer } = getState();
    dispatch(setZoom(0, buffer.length || 0));
  };
}
