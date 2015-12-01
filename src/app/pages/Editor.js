import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Row, Col, ButtonInput, Input, Jumbotron, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setBufferFromFile, setBufferFromUrl } from '../actions/buffer';
import AudioEditor from '../components/AudioEditor';

class Editor extends Component {
  componentDidMount() {
    this.boundHandleFileSelect =  this.handleFileSelect.bind(this);
    window.addEventListener('dragover', this.handleFileDrag, false);
    window.addEventListener('dragleave', this.handleFileDrag);
    window.addEventListener('drop', this.boundHandleFileSelect, false);
  }
  componentWillUnmount() {
    window.removeEventListener('dragover', this.handleFileDrag);
    window.removeEventListener('dragleave', this.handleFileDrag);
    window.removeEventListener('drop', this.boundHandleFileSelect);
  }
  handleFileButtonClick() {
    const fileButtonContainer = findDOMNode(this.refs.fileButtonContainer);
    const fileButton = fileButtonContainer.querySelector('input[type="file"]');
    fileButton.click();
  }
  handleFileDrag(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  handleFileSelect(e) {
    const { dispatch } = this.props;

    // cancel event
    this.handleFileDrag(e);

    // fetch FileList object
    const files = e.target.files || e.dataTransfer.files;

    // process last file only
    if (files.length) {
      dispatch(setBufferFromFile(files[files.length - 1]));
    }
  }
  render() {
    const {
      dispatch,
      audioContext,
      buffer,
      name,
      sampleRate
    } = this.props;
    return (
      <div>
        <Row>
          <Col md={4}>
            <Jumbotron>
              <h4>Audio Editor</h4>
              You can drag-and-drop an audio file onto the window, choose from
              an example file below, or use the open file button to select a
              file to open from your computer.
              <hr />
              <form>
                <Row>
                  <Col md={12}>
                    <Input
                      ref="fileButtonContainer"
                      type="file"
                      wrapperClassName="btn-file"
                      label="Select a file from your computer"
                      onChange={this.handleFileSelect.bind(this)}
                    />
                    <ButtonInput
                      value="Choose Local File"
                      onClick={this.handleFileButtonClick.bind(this)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Input type="select" placeholder="select">
                      <option value="loop225">loop225</option>
                    </Input>
                  </Col>
                  <Col md={6}>
                    <ButtonInput
                      value="Load Example"
                      onClick={() => {
                        dispatch(setBufferFromUrl('/audio-editor/audio/loop225.mp3'));
                      }} />
                  </Col>
                </Row>
              </form>
              <Table>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{name}</td>
                  </tr>
                  <tr>
                    <th>Sample Rate</th>
                    <td>{sampleRate}</td>
                  </tr>
                  <tr>
                    <th>Length (in samples)</th>
                    <td>{buffer.length}</td>
                  </tr>
                </tbody>
              </Table>
            </Jumbotron>
          </Col>
          <Col md={8}>
            <AudioEditor
              audioContext={audioContext}
            />
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
    name: state.name,
    sampleRate: state.sampleRate
  };
})(Editor);
