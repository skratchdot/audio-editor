import React, { Component } from 'react';
import { Row, Col, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setPlaybackType } from '../actions/playbackType';

class PlayBar extends Component {
  handlePlaybackTypeChange(value) {
    const { dispatch } = this.props;
    dispatch(setPlaybackType(value));
  }
  render() {
    const self = this;
    const bsStyle = 'success';
    const bsSize = 'xsmall';
    const padRight = '5px';
		return (
      <div>
        <Row>
          <Col md={12}>
            <Button
              bsStyle={bsStyle}
              bsSize={bsSize}
              style={{marginRight: padRight}}>
                <Glyphicon glyph="fast-backward" />
            </Button>
            <Button
              bsStyle={bsStyle}
              bsSize={bsSize}
              style={{marginRight: padRight}}
              onClick={self.handlePlaybackTypeChange.bind(self, -1)}>
                <Glyphicon glyph="step-backward" />
                Reverse
            </Button>
            <Button
              bsStyle={bsStyle}
              bsSize={bsSize}
              style={{marginRight: padRight}}
              onClick={self.handlePlaybackTypeChange.bind(self, 0)}>
                <Glyphicon glyph="stop" />
                &nbsp;
                Stop
            </Button>
            <Button
              bsStyle={bsStyle}
              bsSize={bsSize}
              style={{marginRight: padRight}}
              onClick={self.handlePlaybackTypeChange.bind(self, 1)}>
                Play
                <Glyphicon glyph="step-forward" />
            </Button>
            <Button
              bsStyle={bsStyle}
              bsSize={bsSize}>
              <Glyphicon glyph="fast-forward" />
            </Button>
          </Col>
        </Row>
      </div>
		);
	}
}

export default connect(function (state) {
  return {
    playbackType: state.playbackType
  };
})(PlayBar);
