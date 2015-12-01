import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import DisplayAmplitudePath from './DisplayAmplitudePath';
import DisplayContainer from './DisplayContainer';
import PlayBar from './PlayBar';

class AudioEditor extends Component {
  render() {
		return (
      <div>
        <Row>
          <Col md={12}>
            <PlayBar />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <DisplayContainer>
              <DisplayAmplitudePath />
            </DisplayContainer>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <DisplayContainer>
              <DisplayAmplitudePath />
            </DisplayContainer>
          </Col>
        </Row>
      </div>
		);
	}
}

export default connect()(AudioEditor);
