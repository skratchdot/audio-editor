import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setPlaybackRate } from '../actions/playbackRate';

class PlaybackRateBar extends Component {
  handlePlaybackRateChange(value) {
    const { dispatch } = this.props;
    dispatch(setPlaybackRate(value));
  }
  render() {
    const { playbackRate } = this.props;
    const self = this;
    const bsStyle = 'primary';
    const bsSize = 'xsmall';
    const padRight = '5px';
		return (
      <div>
        <Row>
          <Col md={12}>
            {[-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2].map(function (val, i) {
              return (
                <Button
                  key={i}
                  active={playbackRate === val}
                  bsStyle={bsStyle}
                  bsSize={bsSize}
                  style={{marginRight: padRight}}
                  onClick={self.handlePlaybackRateChange.bind(self, val)}>
                  {val}
                </Button>
              );
            })}
          </Col>
        </Row>
      </div>
		);
	}
}

export default connect(function (state) {
  return {
    playbackRate: state.playbackRate
  };
})(PlaybackRateBar);
