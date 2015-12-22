import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setMuted } from '../actions/muted';
import { setVolume } from '../actions/volume';
import MuteButton from '../components/MuteButton';
import Range from '../components/Range';

class VolumeSlider extends Component {
  handleVolumeChange(value) {
    const { dispatch } = this.props;
    dispatch(setMuted(value === 0 ? true : false));
    dispatch(setVolume(value));
  }
  render() {
    const { muted, volume } = this.props;
		return (
      <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 8
        }}>
        <div>
            <small>Volume:</small>
            &nbsp;
            <strong>{muted ? '0.00' : volume.toFixed(2)}</strong>
        </div>
        <div style={{marginLeft: 10, marginRight: 10, marginTop: -2}}>
          <MuteButton />
        </div>
        <div style={{width: '50%'}}>
          <Range
            value={muted ? 0 : volume}
            step={0.01}
            min={0}
            max={1}
            onInput={this.handleVolumeChange.bind(this)}
          />
        </div>
      </div>
		);
	}
}

export default connect(function (state) {
  return {
    muted: state.muted,
    volume: state.volume
  };
})(VolumeSlider);
