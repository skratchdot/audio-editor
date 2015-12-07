import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import arrayGet from 'array-any-index';
import ease from 'd3-ease';
import DisplayAmplitudePath from './DisplayAmplitudePath';
import DisplayContainer from './DisplayContainer';
import DisplayMessage from './DisplayMessage';
import DisplayPlaybackPosition from './DisplayPlaybackPosition';
import PlayBar from './PlayBar';
import PlaybackPositionSlider from './PlaybackPositionSlider';
import PlaybackRateBar from './PlaybackRateBar';
import PlaybackRateSlider from './PlaybackRateSlider';
import VolumeSlider from './VolumeSlider';
import WaveformDataDebugBar from './WaveformDataDebugBar';
import ZoomBar from './ZoomBar';
import ZoomSlider from './ZoomSlider';
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
    this.audioProcessor = audioContext.createScriptProcessor(Math.pow(2, 12), 1, 1);
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
  getNormalizedPosition() {
    const { buffer } = this.props;
    let pos = (this.audioPosition % buffer.length) || 0;
    if (pos < 0) {
      pos = buffer.length + pos;
    }
    return pos;
  }
  handleUpdatePlaybackPosition() {
    const { dispatch, buffer, playbackScrubbing } = this.props;
    if (buffer.length && !playbackScrubbing) {
      const pos = this.getNormalizedPosition.call(this);
      dispatch(setPlaybackPosition(pos, types.SOURCE_ON_AUDIO_PROCESS));
    }
    raf(this.handleUpdatePlaybackPosition.bind(this));
  }
  onAudioProcess(e) {
    const {
      buffer,
      playbackPosition,
      playbackRate,
      playbackScrubbing,
      playbackType,
      volume
    } = this.props;
    let positionDelta = 0;
    let scrubStart = this.lastScrub;
    let scrubEnd = this.lastScrub;
    let scrubLength = scrubEnd - scrubStart;
    const channelData = [];
    const output = e.outputBuffer.getChannelData(0);
    if (buffer.length &&
      typeof buffer.numberOfChannels === 'number' &&
      playbackType !== 0) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        channelData[i] = buffer.getChannelData(i);
      }
    }
    if (playbackScrubbing) {
      if (this.lastScrub !== playbackPosition.position) {
        if (Number.isFinite(this.lastScrub)) {
          scrubStart = this.lastScrub;
        } else {
          scrubStart = this.getNormalizedPosition.call(this);
        }
        scrubEnd = playbackPosition.position;
        scrubLength = scrubEnd - scrubStart;
        this.lastScrub = playbackPosition.position;
      }
    } else if (playbackType > 0) {
      positionDelta = playbackRate;
    } else if (playbackType < 0) {
      positionDelta = 0 - playbackRate;
    }
    const maxLength = output.length - 1;
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
      if (playbackScrubbing) {
        const easePosition = ease.linear(i / maxLength);
        this.audioPosition = (scrubStart + (easePosition * scrubLength));
      } else {
        this.audioPosition += positionDelta;
      }
    }
  }
  render() {
    const { buffer, playbackPosition, waveformData, zoom } = this.props;
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
              <DisplayPlaybackPosition min={zoom.start} max={zoom.end} />
              <DisplayMessage { ...waveformData.zoom } />
            </DisplayContainer>
            <PlaybackPositionSlider min={zoom.start} max={zoom.end} />
            <Row>
              <Col md={6}>
                <ZoomBar />
              </Col>
              <Col md={6}>
                <WaveformDataDebugBar { ...waveformData.zoom } />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <DisplayContainer>
              <DisplayAmplitudePath { ...waveformData.overview } height={50} />
              <DisplayPlaybackPosition min={0} max={buffer.length - 1} />
              <ZoomSlider />
              <DisplayMessage { ...waveformData.overview } />
            </DisplayContainer>
            <PlaybackPositionSlider min={0} max={buffer.length - 1} />
            <Row>
              <Col md={6}>
                <small>Position: {Math.round(playbackPosition.position)}</small>
              </Col>
              <Col md={6}>
                <WaveformDataDebugBar { ...waveformData.overview } />
              </Col>
            </Row>
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
    playbackScrubbing: state.playbackScrubbing,
    playbackType: state.playbackType,
    volume: state.volume,
    waveformData: state.waveformData,
    zoom: state.zoom
  };
})(AudioEditor);
