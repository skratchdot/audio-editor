import React, { Component } from 'react';
import { connect } from 'react-redux';
import getPath from 'object-path-get';

class WaveformAmplitude extends Component {
  render() {
    const self = this;
    const {
      statsWaveform,
      key,
      start,
      end,
      suffix,
      width,
      height
    } = this.props;
    const styles = {
      width: width,
      height: height
    };
    const color = 'rgba(0, 0, 200, 0.5)';
    const strokeColor = 'rgba(80, 80, 80, 0.5)';
    // get the right stats
    let stats = {};
    for (let i = 0; i < statsWaveform.length; i++) {
      if (statsWaveform[i].key === key) {
        stats = statsWaveform[i];
        break;
      }
    }
    const posMax = getPath(stats, `pathsPosMax${suffix}`, '');
    const posAvg = getPath(stats, `pathsPosAvg${suffix}`, '');
    const negAvg = getPath(stats, `pathsNegAvg${suffix}`, '');
    const negMin = getPath(stats, `pathsNegMin${suffix}`, '');
		return (
      <svg
        className="display-amplitude-path"
        style={styles}
        viewBox={`${start} -1 ${end - start} 2`}
        preserveAspectRatio="none">
        <g>
          <line x1={start} y1={0} x2={end} y2={0}
            stroke={strokeColor} strokeWidth={0.01} />
        </g>
        <g>
          <path d={posMax} fill={color} />
          <path d={negMin} fill={color} />
        </g>
        <g>
          <path d={posAvg} fill={color} />
          <path d={negAvg} fill={color} />
        </g>
      </svg>
		);
	}
}

WaveformAmplitude.defaultProps = Object.assign({
  key: 1024,
  start: 0,
  end: 0,
  suffix: 'Mono',
  width: '100%',
  height: 200
});

export default connect(function (state) {
  return {
    statsWaveform: state.statsWaveform
  };
})(WaveformAmplitude);
