import React, { Component } from 'react';
import { connect } from 'react-redux';

class Range extends Component {
  constructor(props) {
    super(props);
    this.boundHandleMouseUp = this.handleMouseUp.bind(this);
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);
  }
  componentWillUnmount() {
    window.removeEventListener('mouseup', this.boundHandleMouseUp);
    window.removeEventListener('mousemove', this.boundHandleMouseMove);
  }
  getValueRatio() {
    const { value, min, max } = this.props;
    const len = max - min;
    let ratio = (value - min) / len;
    ratio = Number.isFinite(ratio) ? ratio : 0;
    ratio = Math.min(1, ratio);
    ratio = Math.max(0, ratio);
    return ratio;
  }
  getPosition(e) {
    const range = this.refs.range.getBoundingClientRect();
    const root = document.documentElement;
    const mouseX = e.clientX - range.left - root.scrollLeft;
    let ratio = mouseX / range.width;
    ratio = Math.min(1, ratio);
    ratio = Math.max(0, ratio);
    return ratio;
  }
  handleMouseDown(e) {
    if (typeof this.props.onMouseDown === 'function') {
      this.props.onMouseDown(e);
    }
    this.handleInput.call(this, e);
    window.addEventListener('mouseup', this.boundHandleMouseUp);
    window.addEventListener('mousemove', this.boundHandleMouseMove);
  }
  handleMouseMove(e) {
    if (typeof this.props.onMouseMove === 'function') {
      this.props.onMouseMove(e);
    }
    this.handleInput.call(this, e);
  }
  handleMouseUp(e) {
    if (typeof this.props.onMouseUp === 'function') {
      this.props.onMouseUp(e);
    }
    this.handleInput.call(this, e);
    window.removeEventListener('mousemove', this.boundHandleMouseMove);
    window.removeEventListener('mouseup', this.boundHandleMouseUp);
  }
  handleInput(e) {
    const { onInput, min, max } = this.props;
    if (typeof onInput === 'function') {
      const newRatio = this.getPosition.call(this, e);
      const len = max - min;
      if (len > 0) {
        const newValue = min + (newRatio * len);
        onInput(newValue);
      }
    }
  }
  render() {
    const { width, height } = this.props;
    const ratio = this.getValueRatio();
    const percentage = `${ratio * 100}%`;
		return (
      <svg
        className="range-component"
        ref="range"
        width={width}
        height={height}
        onMouseDown={this.handleMouseDown.bind(this)}
        style={{
          overflow: 'visible',
          cursor: 'pointer'
        }}>
        <line
          stroke="#ccc"
          strokeWidth="4"
          strokeLinecap="round"
          y2="50%" x1="0" y1="50%" x2="100%"
        />
        <circle r="7" cx={percentage} cy="50%" fill="#eee" stroke="#666" stroke-width="1" />
      </svg>
		);
	}
}

Range.defaultProps = {
  width: '100%',
  height: 20,
  min: 0,
  max: 100,
  step: 1,
  value: 0
};

export default connect()(Range);
