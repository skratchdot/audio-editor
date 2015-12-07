import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setZoom, setZoomEdit, zoomMoveCenter } from '../actions/zoom';

class ZoomSlider extends Component {
  componentDidMount() {
    this.boundCenter = this.handleCenter.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mouseup', this.boundMouseUp);
  }
  componentWillUnmount() {
    window.removeEventListener('mouseup', this.boundMouseUp);
    window.removeEventListener('mousemove', this.boundMouseMove);
  }
  getPosition(e) {
    const zoomWindow = this.refs.zoomSlider.getBoundingClientRect();
    const root = document.documentElement;
    const mouseX = e.clientX - zoomWindow.left - root.scrollLeft;
    let ratio = mouseX / zoomWindow.width;
    ratio = Math.min(1, ratio);
    ratio = Math.max(0, ratio);
    return ratio;
  }
  handleCenter(e) {
    const { dispatch } = this.props;
    const ratio = this.getPosition.call(this, e);
    dispatch(zoomMoveCenter(ratio));
  }
  handleMouseDown(e) {
    const { dispatch } = this.props;
    if (e.target === this.refs.zoomMiddle || e.target === this.refs.zoomSlider) {
      dispatch(setZoomEdit(true, 'move'));
      this.boundCenter(e);
    } else if (e.target === this.refs.zoomLeft) {
      dispatch(setZoomEdit(true, 'changeLeft'));
    } else if (e.target === this.refs.zoomRight) {
      dispatch(setZoomEdit(true, 'changeRight'));
    }
    window.addEventListener('mousemove', this.boundMouseMove);
  }
  handleMouseUp() {
    const { dispatch } = this.props;
    window.removeEventListener('mousemove', this.boundMouseMove);
    dispatch(setZoomEdit(false));
  }
  handleMouseMove(e) {
    const { dispatch, buffer, zoom } = this.props;
    if (zoom.isEditing) {
      if (zoom.editType === 'move') {
        this.boundCenter(e);
      } else {
        const ratio = this.getPosition.call(this, e);
        const newValue = buffer.length * ratio;
        if (zoom.editType === 'changeLeft') {
          dispatch(setZoom(newValue, zoom.end));
        } else if (zoom.editType === 'changeRight') {
          dispatch(setZoom(zoom.start, newValue));
        }
      }
    }
  }
  render() {
    const { buffer, zoom } = this.props;
    const style = {};
    const size = Math.max(buffer.length, 1);
    const left = (zoom.start / size) * 100;
    let width = Math.max(zoom.length, 1);
    width = (width / size) * 100;
    style.left = `${left}%`;
    style.width = `${width}%`;
		return (
      <div ref="zoomSlider" className={`zoom-slider edit-type-${zoom.editType}`} onMouseDown={this.handleMouseDown.bind(this)}>
        <div ref="zoomThumb" className="zoom-slider-thumb" style={style}>
          <div ref="zoomLeft" className="zoom-slider-item zoom-slider-left"></div>
          <div ref="zoomMiddle" className="zoom-slider-item zoom-slider-middle"></div>
          <div ref="zoomRight" className="zoom-slider-item zoom-slider-right"></div>
        </div>
      </div>
		);
	}
}

export default connect(function (state) {
  return {
    buffer: state.buffer,
    zoom: state.zoom
  };
})(ZoomSlider);
