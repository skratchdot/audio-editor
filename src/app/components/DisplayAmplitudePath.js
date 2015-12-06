import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getWaveformDataSchema } from '../defaults/waveformData';

class DisplayAmplitudePath extends Component {
  render() {
    const self = this;
    const styles = {
      width: this.props.width,
      height: this.props.height
    };
    let size = 0;
    ['posMax', 'negMax', 'posMin', 'negMin'].forEach(function (key) {
      if (self.props[key]) {
        size = Math.max(size, self.props[key].length || 0);
      }
    });
    const color = 'rgba(0, 0, 200, 0.5)';
    const strokeColor = 'rgba(80, 80, 80, 0.5)';
    const getPath = function (key) {
      let d = 'M0 0 L0 0';
      if (self.props.hasOwnProperty(key)) {
        self.props[key].forEach(function (item, i) {
          d += ` L${i} ${0 - item}`;
        });
      }
      d += ` L${size - 1} 0 Z`;
      return d;
    };
		return (
      <svg
        className="display-amplitude-path"
        style={styles}
        viewBox={`0 -1 ${size - 1} 2`}
        preserveAspectRatio="none">
        <g>
          <line x1={0} y1={0} x2={size} y2={0}
            stroke={strokeColor} strokeWidth={0.01} />
        </g>
        <g>
          <path d={getPath('posMax')} fill={color} />
          <path d={getPath('negMax')} fill={color} />
        </g>
        <g>
          <path d={getPath('posAvg')} fill={color} />
          <path d={getPath('negAvg')} fill={color} />
        </g>
      </svg>
		);
	}
}

DisplayAmplitudePath.defaultProps = Object.assign({
  width: '100%',
  height: 200
}, getWaveformDataSchema());

export default connect()(DisplayAmplitudePath);
