import React, { Component } from 'react';
import { connect } from 'react-redux';

class DisplayPlaybackPosition extends Component {
  render() {
    const { playbackPosition, min, max } = this.props;
    let pos = 0;
    let display = 'none';
    const len = max - min;
    if (len > 0 &&
      playbackPosition.position > min &&
      playbackPosition.position < max) {
      pos = ((playbackPosition.position - min) / len) * 100;
      display = 'block';
    }
    const styles = {
      position: 'absolute',
      display: display,
      overflow: 'hidden',
      width: 1,
      height: '100%',
      top: 0,
      left: `${pos}%`,
      backgroundColor: 'rgba(200, 0, 0, 0.7)'
    };
		return (
      <div style={styles}></div>
		);
	}
}

DisplayPlaybackPosition.defaultProps = {
  min: 0,
  max: 0
};

export default connect(function (state) {
  return {
    buffer: state.buffer,
    playbackPosition: state.playbackPosition
  };
})(DisplayPlaybackPosition);
