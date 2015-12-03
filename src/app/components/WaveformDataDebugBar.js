import React, { Component } from 'react';
import { connect } from 'react-redux';
import humanizeDuration from 'humanize-duration';

class WaveformDataDebugBar extends Component {
  render() {
		return (
      <div style={{textAlign: 'right'}}>
        <small>
          Render Time:
          &nbsp;
          {humanizeDuration(this.props.renderTime)}
        </small>
      </div>
		);
	}
}

WaveformDataDebugBar.defaultProps = {
  renderTime: 0
};

export default connect()(WaveformDataDebugBar);
