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
      <div>
        <Row>
          <Col md={6} className="text-right">
            <small>Volume:</small>
            &nbsp;
            <strong>{volume.toFixed(2)}</strong>
          </Col>
          <Col md={6}>
            <Range
              value={volume}
              step={0.01}
              min={0}
              max={1}
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
