import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setVolume } from '../actions/volume';
import Range from '../components/Range';

class VolumeSlider extends Component {
  handleVolumeChange(value) {
    const { dispatch } = this.props;
    dispatch(setVolume(value));
  }
  render() {
    const { volume } = this.props;
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
            <strong>{volume.toFixed(2)}</strong>
        </div>
        <div style={{marginLeft: 20, width: '50%'}}>
          <Range
            value={volume}
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
    volume: state.volume
  };
})(VolumeSlider);
