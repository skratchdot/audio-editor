import React, { Component } from 'react';
import { connect } from 'react-redux';

class ZoomSlider extends Component {
  render() {
    const { buffer, zoom } = this.props;
    const style = {
      left: zoom.start
    };
    const size = Math.max(buffer.length, 1);
    const len = Math.max(zoom.end - zoom.start, 1);
    style.width = `${(len / size) * 100}%`;
		return (
      <div className="zoom-slider" style={style}>
        <div className="zoom-slider-item zoom-slider-left"></div>
        <div className="zoom-slider-item zoom-slider-middle"></div>
        <div className="zoom-slider-item zoom-slider-right"></div>
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
