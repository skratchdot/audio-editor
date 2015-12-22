import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setMuted, toggleMuted } from '../actions/muted';

class MuteButton extends Component {
  toggleMuted() {
    const { dispatch, volume } = this.props;
    if (volume > 0) {
      dispatch(toggleMuted());
    } else {
      dispatch(setMuted(true));
    }
  }
  render() {
    const { muted } = this.props;
    const bsStyle = 'default';
    const bsSize = 'xsmall';
    const glyph = 'volume-off';
		return (
      <Button
        active={muted}
        bsStyle={bsStyle}
        bsSize={bsSize}
        onClick={this.toggleMuted.bind(this)}>
          <Glyphicon glyph={glyph} />
      </Button>
		);
	}
}

export default connect(function (state) {
  return {
    muted: state.muted,
    volume: state.volume
  };
})(MuteButton);
