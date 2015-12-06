import React, { Component } from 'react';
import { connect } from 'react-redux';

class DisplayMessage extends Component {
  render() {
    const { validFile } = this.props;
    let extraClassInfo = 'display-message-show';
    const messages = [];
    if (!validFile.isValid) {
      messages.push(<strong key="invalid">No file loaded.</strong>);
      if (validFile.message && validFile.message.length) {
        messages.push(<strong key="validFileMessage">&nbsp;&nbsp;{validFile.message}</strong>);
      }
    }
    if (validFile.isValid) {
      extraClassInfo = 'display-message-hide';
    }
    return (
      <div className={`display-message ${extraClassInfo}`}>
        <div className="display-message-box">
          {messages}
        </div>
      </div>
    );
	}
}

export default connect(function (state) {
  return {
    validFile: state.validFile
  };
})(DisplayMessage);
