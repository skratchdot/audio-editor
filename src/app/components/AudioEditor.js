import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import arrayGet from 'array-any-index';
import DisplayAmplitudePath from './DisplayAmplitudePath';
import DisplayContainer from './DisplayContainer';
import PlayBar from './PlayBar';
import PlaybackRateBar from './PlaybackRateBar';
import PlaybackRateSlider from './PlaybackRateSlider';
import VolumeSlider from './VolumeSlider';
import WaveformDataDebugBar from './WaveformDataDebugBar';
import { setPlaybackPosition } from '../actions/playbackPosition';
import { setPlaybackType } from '../actions/playbackType';
import raf from 'raf';
import * as types from '../constants/ActionTypes';

class AudioEditor extends Component {
  constructor(props) {
    super(props);
    this.audioPosition = 0;
    this.audioSource = null;
    this.audioProcessor = null;
  }
  componentDidMount() {
    const { audioContext, playbackPosition } = this.props;
    this.audioPosition = playbackPosition.position || 0;
    this.audioSource = audioContext.createBufferSource();
    this.audioSource.loop = true;
    this.audioProcessor = audioContext.createScriptProcessor(Math.pow(2, 8), 1, 1);
    this.audioProcessor.onaudioprocess = this.onAudioProcess.bind(this);
    // connect
    this.audioSource.connect(this.audioProcessor);
    this.audioProcessor.connect(audioContext.destination);
    // requestAnimationFrame
    raf(this.handleUpdatePlaybackPosition.bind(this));
  }
  componentWillReceiveProps(nextProps) {
    const { playbackPosition } = nextProps;
    if (playbackPosition.source !== types.SOURCE_ON_AUDIO_PROCESS &&
      Number.isFinite(playbackPosition.position)) {
      this.audioPosition = playbackPosition.position;
    }
  }
  componentWillUnmount() {
    const { dispatch, audioContext } = this.props;
    // disconnect
    this.audioProcessor.disconnect(audioContext.destination);
    this.audioSource.disconnect(this.audioProcessor);
    this.audioProcessor = null;
    this.audioSource = null;
    dispatch(setPlaybackType(0));
  }
  handleUpdatePlaybackPosition() {
    const { dispatch, buffer } = this.props;
    if (buffer.length) {
      let pos = this.audioPosition % buffer.length;
      if (pos < 0) {
        pos = buffer.length + pos;
      }
      dispatch(setPlaybackPosition(pos, types.SOURCE_ON_AUDIO_PROCESS));
    }
    raf(this.handleUpdatePlaybackPosition.bind(this));
  }
  onAudioProcess(e) {
    const {
      buffer,
      playbackRate,
      playbackType,
      volume
    } = this.props;
    const channelData = [];
    const output = e.outputBuffer.getChannelData(0);
    if (buffer.length &&
      typeof buffer.numberOfChannels === 'number' &&
      playbackType !== 0) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        channelData[i] = buffer.getChannelData(i);
      }
    }
    for (let i = 0; i < output.length; i++) {
      output[i] = 0;
      for (let j = 0; j < channelData.length; j++) {
        // mix output
        output[i] += arrayGet(channelData[j], this.audioPosition);
      }
      // adjust output
      if (channelData.length > 1) {
        output[i] = output[i] / channelData.length;
      }
      // add volume
      output[i] = output[i] * volume;
      if (playbackType > 0) {
        this.audioPosition = this.audioPosition + playbackRate;
      } else if (playbackType < 0) {
        this.audioPosition = this.audioPosition - playbackRate;
      }
    }
  }
  render() {
    const { playbackPosition, waveformData } = this.props;
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
              <DisplayAmplitudePath { ...waveformData.zoom } />
            </DisplayContainer>
            <WaveformDataDebugBar { ...waveformData.zoom } />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <DisplayContainer>
              <DisplayAmplitudePath { ...waveformData.overview } height={50} />
            </DisplayContainer>
            <WaveformDataDebugBar { ...waveformData.overview } />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            Position: {playbackPosition.position}
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
    playbackPosition: state.playbackPosition,
    playbackRate: state.playbackRate,
    playbackType: state.playbackType,
    volume: state.volume,
    waveformData: state.waveformData
  };
})(AudioEditor);
