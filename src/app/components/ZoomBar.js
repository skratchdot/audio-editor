import React, { Component } from 'react';
import { Button, Glyphicon, Collapse, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as zoomFunctions from '../actions/zoom';

class ZoomBar extends Component {
  handleZoom(fnName) {
    const { dispatch } = this.props;
    if (zoomFunctions.hasOwnProperty(fnName)) {
      dispatch(zoomFunctions[fnName]());
    }
  }
  handleSlide(type, e) {
    const { dispatch, zoom } = this.props;
    if (type === 'start') {
      dispatch(zoomFunctions.setZoom(e.target.value, zoom.end));
    } else if (type === 'end') {
      dispatch(zoomFunctions.setZoom(zoom.start, e.target.value));
    }
  }
  render() {
    const { dispatch, buffer, zoom } = this.props;
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
        &nbsp;&nbsp;&nbsp;
        <a style={{cursor: 'pointer'}} onClick={() => {
            dispatch(zoomFunctions.toggleZoomPanel());
          }}><small>1 : {ratio}</small></a>
        <Collapse in={zoom.zoomPanelExpanded}>
          <Panel header="Zoom Info" bsStyle="info" style={{marginTop: 10}}>
            <div>
              Zoom Length: {zoom.length}
            </div>
            <hr />
            <div>
              Start: {zoom.start}
              <input
                type="range"
                step="1"
                min="0"
                max={buffer.length}
                value={zoom.start}
                onChange={this.handleSlide.bind(this, 'start')}
                onInput={this.handleSlide.bind(this, 'start')}
              />
            </div>
            <div>
              End: {zoom.end}
              <input
                type="range"
                step="1"
                min="0"
                max={buffer.length}
                value={zoom.end}
                onChange={this.handleSlide.bind(this, 'end')}
                onInput={this.handleSlide.bind(this, 'end')}
              />
            </div>
          </Panel>
        </Collapse>
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
