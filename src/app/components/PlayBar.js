import React, { Component } from 'react';
import { Row, Col, Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';

class PlayBar extends Component {
  render() {
    const bsStyle = 'success';
    const bsSize = 'xsmall';
    const padRight = '5px';
		return (
      <div>
        <Row>
          <Col md={12}>
            <Button bsStyle={bsStyle} bsSize={bsSize} style={{marginRight: padRight}}>
              <Glyphicon glyph="fast-backward" />
            </Button>
            <Button bsStyle={bsStyle} bsSize={bsSize} style={{marginRight: padRight}}>
              <Glyphicon glyph="step-backward" />
              Reverse
            </Button>
            <Button bsStyle={bsStyle} bsSize={bsSize} style={{marginRight: padRight}}>
              <Glyphicon glyph="stop" />
              &nbsp;
              Stop
            </Button>
            <Button bsStyle={bsStyle} bsSize={bsSize} style={{marginRight: padRight}}>
              Play
              <Glyphicon glyph="step-forward" />
            </Button>
            <Button bsStyle={bsStyle} bsSize={bsSize}>
              <Glyphicon glyph="fast-forward" />
            </Button>
          </Col>
        </Row>
      </div>
		);
	}
}

export default connect()(PlayBar);
