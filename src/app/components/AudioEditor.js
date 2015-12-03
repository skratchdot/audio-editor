import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import humanizeDuration from 'humanize-duration';
import DisplayAmplitudePath from './DisplayAmplitudePath';
import DisplayContainer from './DisplayContainer';
import PlayBar from './PlayBar';

class AudioEditor extends Component {
  render() {
    const { waveformData } = this.props;
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
              <DisplayAmplitudePath { ...waveformData } />
            </DisplayContainer>
            <div style={{textAlign: 'right'}}>
              <small>
                Render Time:
                &nbsp;
                {humanizeDuration(waveformData.renderTime)}
              </small>
            </div>
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

export default connect(function (state) {
  return {
    waveformData: state.waveformData
  };
})(AudioEditor);
