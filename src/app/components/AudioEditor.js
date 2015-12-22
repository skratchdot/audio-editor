import React, { Component } from 'react';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import { connect } from 'react-redux';
import AudioPlayer from './AudioPlayer';
import WaveformAmplitude from './display/WaveformAmplitude';
import DisplayContainer from './DisplayContainer';
import DisplayMessage from './DisplayMessage';
import DisplayPlaybackPosition from './DisplayPlaybackPosition';
import MonoButtonGroup from './MonoButtonGroup';
import PlayBar from './PlayBar';
import PlaybackPositionSlider from './PlaybackPositionSlider';
import PlaybackRateBar from './PlaybackRateBar';
import PlaybackRateSlider from './PlaybackRateSlider';
import VolumeSlider from './VolumeSlider';
import ZoomBar from './ZoomBar';
import ZoomSlider from './ZoomSlider';

class AudioEditor extends Component {
  render() {
    const { buffer, mono, playbackType, playbackPosition, zoom } = this.props;
    const audioPlayer = playbackType === 0 ? '' : <AudioPlayer />;
    const zoomDisplay = [];
    if (mono || buffer.length === 0) {
      zoomDisplay.push(
        <WaveformAmplitude
          key="mono"
          type="mono"
          zoomLevel={1}
          start={zoom.start}
          end={zoom.end}
        />
      );
    } else {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        if (i > 0) {
          zoomDisplay.push(
            <div key={`spacer${i}`} style={{
              height: 2,
              backgroundColor: '#aaa'
            }}>&nbsp;</div>
          );
        }
        zoomDisplay.push(
          <WaveformAmplitude
            key={`channels.${i}`}
            type={`channels.${i}`}
            zoomLevel={1}
            start={zoom.start}
            end={zoom.end}
          />
        );
      }
    }
		return (
      <div>
        {audioPlayer}
        <Row>
          <Col md={6}>
            <Jumbotron className="jumbo-control">
              <PlayBar />
              <VolumeSlider />
            </Jumbotron>
          </Col>
          <Col md={6}>
            <Jumbotron className="jumbo-control">
              <PlaybackRateBar />
              <PlaybackRateSlider />
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <DisplayContainer>
              <div style={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                {zoomDisplay}
              </div>
              <DisplayPlaybackPosition min={zoom.start} max={zoom.end} />
              <DisplayMessage showExtended={true} />
            </DisplayContainer>
            <PlaybackPositionSlider min={zoom.start} max={zoom.end} />
            <Row>
              <Col md={6}>
                <ZoomBar />
              </Col>
              <Col md={6} style={{display: 'flex', justifyContent: 'flex-end'}}>
                <MonoButtonGroup />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <DisplayContainer>
              <WaveformAmplitude
                zoomLevel={1}
                start={0}
                end={buffer.length - 1}
                type="mono"
                height={50}
              />
              <DisplayPlaybackPosition min={0} max={buffer.length - 1} />
              <ZoomSlider />
              <DisplayMessage />
            </DisplayContainer>
            <PlaybackPositionSlider min={0} max={buffer.length - 1} />
            <Row>
              <Col md={6}>
                <small>Position: {Math.round(playbackPosition.position)}</small>
              </Col>
              <Col md={6}>
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
    buffer: state.buffer,
    mono: state.mono,
    muted: state.muted,
    playbackPosition: state.playbackPosition,
    playbackType: state.playbackType,
    volume: state.volume,
    zoom: state.zoom
  };
})(AudioEditor);
