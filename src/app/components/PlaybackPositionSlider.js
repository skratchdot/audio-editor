import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setPlaybackPosition } from '../actions/playbackPosition';

class PlaybackPositionSlider extends Component {
  handlePlaybackPositionChange(e) {
    const { dispatch } = this.props;
    dispatch(setPlaybackPosition(e.target.value, 'PlaybackPositionSlider'));
  }
  render() {
    const { playbackPosition, min, max } = this.props;
		return (
      <div>
        <Row>
          <Col md={12}>
            <input
              type="range"
              value={playbackPosition.position}
              step={1}
              min={min}
              max={max}
              onChange={this.handlePlaybackPositionChange.bind(this)}
              onInput={this.handlePlaybackPositionChange.bind(this)}
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
