import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setPlaybackPosition } from '../actions/playbackPosition';
import { setPlaybackScrubbing } from '../actions/playbackScrubbing';
import Range from '../components/Range';

class PlaybackPositionSlider extends Component {
  handlePlaybackPositionChange(value) {
    const { dispatch } = this.props;
    dispatch(setPlaybackPosition(value, 'PlaybackPositionSlider'));
  }
  handlePlaybackScrubChange(value) {
    const { dispatch } = this.props;
    dispatch(setPlaybackScrubbing(value));
  }
  render() {
    const { playbackPosition, min, max } = this.props;
		return (
      <div>
        <Row>
          <Col md={12}>
            <Range
              value={playbackPosition.position}
              step={1}
              min={min}
              max={max}
              onInput={this.handlePlaybackPositionChange.bind(this)}
              onMouseDown={this.handlePlaybackScrubChange.bind(this, true)}
              onMouseUp={this.handlePlaybackScrubChange.bind(this, false)}
            />
          </Col>
        </Row>
      </div>
		);
	}
}

PlaybackPositionSlider.defaultProps = {
  min: 0,
  max: 0
};

export default connect(function (state) {
  return {
    playbackPosition: state.playbackPosition
  };
})(PlaybackPositionSlider);
