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
    const { mono } = this.props;
    const bsSize = 'xsmall';
		return (
      <ButtonToolbar>
        <ButtonGroup bsSize={bsSize}>
          <Button active={mono} onClick={this.setMono.bind(this, true)}>Mono</Button>
          <Button active={!mono} onClick={this.setMono.bind(this, false)}>Stereo</Button>
        </ButtonGroup>
      </ButtonToolbar>
		);
	}
}

export default connect(function (state) {
  return {
    mono: state.mono
  };
})(MuteButton);
