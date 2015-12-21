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
      <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 8
        }}>
        <div>
          <small>Playback Rate:</small>
          &nbsp;
          <strong>{playbackRate.toFixed(2)}</strong>
        </div>
        <div style={{marginLeft: 20, width: '50%'}}>
          <Range
            value={playbackRate}
            step={0.01}
            min={-2}
            max={2}
            onInput={this.handlePlaybackRateChange.bind(this)}
          />
        </div>
      </div>
		);
	}
}

export default connect(function (state) {
  return {
    playbackRate: state.playbackRate
  };
})(PlaybackRateSlider);
