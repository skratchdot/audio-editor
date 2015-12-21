import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setPlaybackRate } from '../actions/playbackRate';
import Range from '../components/Range';

class PlaybackRateSlider extends Component {
  handlePlaybackRateChange(value) {
    const { dispatch } = this.props;
    dispatch(setPlaybackRate(value));
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
            <Range
              value={playbackRate}
              step={0.01}
              min={-2}
              max={2}
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
