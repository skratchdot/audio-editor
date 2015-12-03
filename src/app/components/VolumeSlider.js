import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setVolume } from '../actions/volume';

class VolumeSlider extends Component {
  handleVolumeChange(e) {
    const { dispatch } = this.props;
    dispatch(setVolume(e.target.value));
  }
  render() {
    const { volume } = this.props;
		return (
      <div>
        <Row>
          <Col md={6} className="text-right">
            <small>Volume:</small>
            &nbsp;
            <strong>{volume.toFixed(2)}</strong>
          </Col>
          <Col md={6}>
            <input
              type="range"
              value={volume}
              step={0.01}
              min={0}
              max={1}
              onChange={this.handleVolumeChange.bind(this)}
              onInput={this.handleVolumeChange.bind(this)}
            />
          </Col>
        </Row>
      </div>
		);
	}
}

export default connect(function (state) {
  return {
    volume: state.volume
  };
})(VolumeSlider);
