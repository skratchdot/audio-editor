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
    const color = 'rgba(0, 0, 200, 0.5)';
    const getPath = function (key) {
      let d = 'M0 0 L0 0';
      if (self.props.hasOwnProperty(key)) {
        self.props[key].forEach(function (item, i) {
          d += ` L${i} ${item}`;
        });
      }
      d += ` L${self.props.size} 0 Z`;
      return d;
    };
		return (
      <svg
        className="display-amplitude-path"
        style={styles}
        viewBox={`0 -1 ${this.props.size} 2`}
        preserveAspectRatio="none">
        <g>
          <path d={getPath('posMax')} fill={color} />
          <path d={getPath('negMax')} fill={color} />
        </g>
        <g>
          <path d={getPath('posAvg')} fill={color} />
          <path d={getPath('negAvg')} fill={color} />
        </g>
        <g>
          <path d={getPath('posMin')} fill={color} />
          <path d={getPath('negMin')} fill={color} />
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
