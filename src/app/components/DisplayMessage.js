import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { end } from '../actions/status';
import raf from 'raf';
import humanizeDuration from 'humanize-duration';

class DisplayMessage extends Component {
  componentDidMount() {
    raf(this.updateStatus.bind(this));
  }
  updateStatus() {
    const { dispatch, status, showExtended } = this.props;
    if (showExtended) {
      if (status.loading) {
        dispatch(end('loading', false));
      } else if (status.decoding) {
        dispatch(end('decoding', false));
      }
      raf(this.updateStatus.bind(this));
    }
  }
  render() {
    const { status, showExtended } = this.props;
    let extended = '';
    const extraClassInfo = `display-message-${status.isValid ? 'hide' : 'show'}`;
    const printRow = function (key) {
      const statusKey = key.toLowerCase();
      const start = status[`${statusKey}Start`];
      const end = status[`${statusKey}End`];
      const time = humanizeDuration(end - start);
      return (
        <tr>
          <td className="text-right">{key}:</td>
          <td>{time}</td>
        </tr>
      );
    };
    if (showExtended) {
      extended = (
        <Table bordered condensed style={{
            marginTop: 10
          }}>
          <tbody>
            {printRow('Loading')}
            {printRow('Decoding')}
          </tbody>
        </Table>
      );
    }
    return (
      <div className={`display-message ${extraClassInfo}`}>
        <div className="display-message-box">
          <div>
            <div><strong>{status.message}</strong></div>
            <div>{extended}</div>
          </div>
        </div>
      </div>
    );
	}
}

export default connect(function (state) {
  return {
    status: state.status
  };
})(DisplayMessage);
