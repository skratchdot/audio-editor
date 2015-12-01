import React, { Component } from 'react';

class DisplayContainer extends Component {
  render() {
    const styles = {
      position: 'relative',
      border: '1px solid black'
    };
		return (
      <div style={styles}>
        {this.props.children}
      </div>
		);
	}
}

export default DisplayContainer;
