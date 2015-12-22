import React, { Component } from 'react';
import { Button, ButtonToolbar, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setMono } from '../actions/mono';

class MuteButton extends Component {
  setMono(value) {
    const { dispatch } = this.props;
    dispatch(setMono(value));
  }
  render() {
    const { buffer, mono } = this.props;
    const bsSize = 'xsmall';
		return (
      <ButtonToolbar>
        <ButtonGroup bsSize={bsSize}>
          <Button active={mono} onClick={this.setMono.bind(this, true)}>
            Mono (1)
          </Button>
          <Button active={!mono} onClick={this.setMono.bind(this, false)}>
            Stereo ({buffer.numberOfChannels || 1})
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
		);
	}
}

export default connect(function (state) {
  return {
    buffer: state.buffer,
    mono: state.mono
  };
})(MuteButton);
