import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as zoomFunctions from '../actions/zoom';

class ZoomBar extends Component {
  handleZoom(fnName) {
    const { dispatch } = this.props;
    if (zoomFunctions.hasOwnProperty(fnName)) {
      dispatch(zoomFunctions[fnName]());
    }
  }
  render() {
    const { buffer, zoom } = this.props;
    const self = this;
    const bsStyle = 'primary';
    const bsSize = 'xsmall';
    const padRight = '5px';
    const len = zoom.end - zoom.start;
    let ratio = Math.max(0, buffer.length - 1) / len;
    ratio = parseFloat(ratio.toFixed(2));
    if (!Number.isFinite(ratio)) {
      ratio = 1;
    }
		return (
      <div>
        <Button
          bsStyle={bsStyle}
          bsSize={bsSize}
          style={{marginRight: padRight}}
          onClick={self.handleZoom.bind(self, 'zoomIn')}>
          <Glyphicon glyph="zoom-in" />
          &nbsp;
          Zoom In
        </Button>
        <Button
          bsStyle={bsStyle}
          bsSize={bsSize}
          style={{marginRight: padRight}}
          onClick={self.handleZoom.bind(self, 'zoomOut')}>
          <Glyphicon glyph="zoom-out" />
          &nbsp;
          Zoom Out
        </Button>
        <Button
          bsStyle={bsStyle}
          bsSize={bsSize}
          onClick={self.handleZoom.bind(self, 'zoomShowAll')}>
          <Glyphicon glyph="resize-horizontal" />
          &nbsp;
          Show All
        </Button>
        &nbsp;
        <small>1 : {ratio}</small>
      </div>
		);
	}
}

export default connect(function (state) {
  return {
    buffer: state.buffer,
    zoom: state.zoom
  };
})(ZoomBar);
