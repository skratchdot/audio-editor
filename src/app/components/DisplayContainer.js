import React, { Component } from 'react';
import { connect } from 'react-redux';

class DisplayContainer extends Component {
  render() {
		return (
      <div className="display-container">
        {this.props.children}
      </div>
		);
	}
}

export default connect()(DisplayContainer);
