import React, { Component } from 'react';
import { connect } from 'react-redux';
import getPath from 'object-path-get';

class WaveformAmplitude extends Component {
  render() {
    const {
      buffer,
      statsWaveform,
      zoomLevel,
      type,
      start,
      end,
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
    const stats = [];
    for (let i = 0; i < statsWaveform.length; i++) {
      if (statsWaveform[i].zoomLevel === zoomLevel) {
        stats.push(statsWaveform[i]);
        break;
      }
    }
    const xMin = start / buffer.length;
    const xMax = end / buffer.length;
    const xLength = xMax - xMin;
    const getSvgPath = function (obj, keyPath) {
      const arr = getPath(obj, type, []);
      let path = `M ${xMin},0`;
      for (let i = 0; i < arr.length; i++) {
        const xPos = i / arr.length;
        path += ` L ${xPos},${getPath(arr[i], keyPath, 0)}`;
      }
      path += ` L ${xMax},0 Z`;
      return path;
    };
		return (
      <svg
        className="display-amplitude-path"
        style={styles}
        viewBox={`${xMin} -1 ${xLength} 2`}
        preserveAspectRatio="none">
        <g>
          <line x1={xMin} y1={0} x2={xLength} y2={0}
            stroke={strokeColor} strokeWidth={0.01} />
        </g>
        {stats.map(function (obj, i) {
          return (
            <g key={i}>
              <path d={getSvgPath(obj, 'pos.max')} fill={color} />
              <path d={getSvgPath(obj, 'neg.min')} fill={color} />
              <path d={getSvgPath(obj, 'pos.mean')} fill={color} />
              <path d={getSvgPath(obj, 'neg.mean')} fill={color} />
            </g>
          );
        })}
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
    buffer: state.buffer,
    statsWaveform: state.statsWaveform
  };
})(WaveformAmplitude);
