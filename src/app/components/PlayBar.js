import React, { Component } from 'react';
import { Row, Col, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setPlaybackPosition } from '../actions/playbackPosition';
import { setPlaybackType } from '../actions/playbackType';

class PlayBar extends Component {
  handlePlaybackTypeChange(value) {
    const { dispatch } = this.props;
    dispatch(setPlaybackType(value));
  }
  handlePlaybackPositionChange(value) {
    const { dispatch, buffer } = this.props;
    if (!Number.isFinite(value)) {
      value = (buffer.length || 1) - 1;
    }
    dispatch(setPlaybackPosition(value, false, 'PlayBar'));
  }
  render() {
    const { playbackType } = this.props;
    const self = this;
    const bsStyle = 'success';
    const bsSize = 'xsmall';
    const padRight = '5px';
		return (
      <div>
        <Row>
          <Col md={12}>
            <Button
              bsStyle={bsStyle}
              bsSize={bsSize}
              style={{marginRight: padRight}}
              onClick={self.handlePlaybackPositionChange.bind(self, 0)}>
                <Glyphicon glyph="fast-backward" />
            </Button>
            <Button
              active={playbackType === -1}
              bsStyle={bsStyle}
              bsSize={bsSize}
              style={{marginRight: padRight}}
              onClick={self.handlePlaybackTypeChange.bind(self, -1)}>
                <Glyphicon glyph="step-backward" />
                Reverse
            </Button>
            <Button
              active={playbackType === 0}
              bsStyle={bsStyle}
              bsSize={bsSize}
              style={{marginRight: padRight}}
              onClick={self.handlePlaybackTypeChange.bind(self, 0)}>
                <Glyphicon glyph="stop" />
                &nbsp;
                Stop
            </Button>
            <Button
              active={playbackType === 1}
              bsStyle={bsStyle}
              bsSize={bsSize}
              style={{marginRight: padRight}}
              onClick={self.handlePlaybackTypeChange.bind(self, 1)}>
                Play
                <Glyphicon glyph="step-forward" />
            </Button>
            <Button
              bsStyle={bsStyle}
              bsSize={bsSize}
              onClick={self.handlePlaybackPositionChange.bind(self)}>
              <Glyphicon glyph="fast-forward" />
            </Button>
          </Col>
        </Row>
      </div>
		);
	}
}

export default connect(function (state) {
  return {
    buffer: state.buffer,
    playbackType: state.playbackType
  };
})(PlayBar);
