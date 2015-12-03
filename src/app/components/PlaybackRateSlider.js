import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setPlaybackRate } from '../actions/playbackRate';

class PlaybackRateSlider extends Component {
  handlePlaybackRateChange(e) {
    const { dispatch } = this.props;
    dispatch(setPlaybackRate(e.target.value));
  }
  render() {
    const { playbackRate } = this.props;
		return (
      <div>
        <Row>
          <Col md={6} className="text-right">
            <small>Playback Rate:</small>
            &nbsp;
            <strong>{playbackRate.toFixed(2)}</strong>
          </Col>
          <Col md={6}>
            <input
              type="range"
              value={playbackRate}
              step={0.01}
              min={-2}
              max={2}
              onChange={this.handlePlaybackRateChange.bind(this)}
              onInput={this.handlePlaybackRateChange.bind(this)}
            />
          </Col>
        </Row>
      </div>
		);
	}
}

export default connect(function (state) {
  return {
    playbackRate: state.playbackRate
  };
})(PlaybackRateSlider);
