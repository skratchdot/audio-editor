import React, { Component } from 'react';
import { connect } from 'react-redux';

class DisplayPlaybackPosition extends Component {
  render() {
    const { buffer, playbackPosition } = this.props;
    let pos = 0;
    if (buffer.length) {
      pos = (playbackPosition.position / buffer.length) * 100;
    }
    const styles = {
      position: 'absolute',
      display: 'block',
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

export default connect(function (state) {
  return {
    buffer: state.buffer,
    playbackPosition: state.playbackPosition
  };
})(DisplayPlaybackPosition);
