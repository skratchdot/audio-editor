import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import arrayGet from 'array-any-index';
import humanizeDuration from 'humanize-duration';
import DisplayAmplitudePath from './DisplayAmplitudePath';
import DisplayContainer from './DisplayContainer';
import PlayBar from './PlayBar';
import PlaybackRateBar from './PlaybackRateBar';
import PlaybackRateSlider from './PlaybackRateSlider';
import VolumeSlider from './VolumeSlider';
const audioProcessBufferSize = 4096;

class AudioEditor extends Component {
  constructor(props) {
    super(props);
    this.audioPosition = 0;
    this.audioSource = null;
    this.audioProcessor = null;
  }
  componentDidMount() {
    const { audioContext } = this.props;
    this.audioPosition = 0;
    this.audioSource = audioContext.createBufferSource();
    this.audioSource.loop = true;
    this.audioProcessor = audioContext.createScriptProcessor(audioProcessBufferSize);
    this.audioProcessor.onaudioprocess = this.onAudioProcess.bind(this);
    // connect
    this.audioSource.connect(this.audioProcessor);
    this.audioProcessor.connect(audioContext.destination);
  }
  componentWillUnmount() {
    const { audioContext } = this.props;
    // disconnect
    this.audioProcessor.disconnect(audioContext.destination);
    this.audioSource.disconnect(this.audioProcessor);
    this.audioProcessor = null;
    this.audioSource = null;
  }
  onAudioProcess(e) {
    const { buffer, playbackRate, volume } = this.props;
    for (let i = 0; i < e.outputBuffer.numberOfChannels; i++) {
      const output = e.outputBuffer.getChannelData(i);
      let data = [0];
      if (buffer.length && buffer.numberOfChannels) {
        // TODO: what happens if buffer.numberOfChannels > output channels?
        data = buffer.getChannelData(Math.min(i, buffer.numberOfChannels));
      }
      for (let j = 0; j < output.length; j++) {
        output[j] = arrayGet(data, this.audioPosition) * volume;
        this.audioPosition = this.audioPosition + playbackRate;
      }
    }
  }
  render() {
    const { waveformData } = this.props;
		return (
      <div>
        <Row>
          <Col md={6}>
            <PlayBar />
          </Col>
          <Col md={6}>
            <PlaybackRateBar />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <VolumeSlider />
          </Col>
          <Col md={6}>
            <PlaybackRateSlider />
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
    audioContext: state.audioContext,
    buffer: state.buffer,
    playbackRate: state.playbackRate,
    volume: state.volume,
    waveformData: state.waveformData
  };
})(AudioEditor);
