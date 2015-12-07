import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Row, Col, Button, Glyphicon, Input, Jumbotron, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import humanizeDuration from 'humanize-duration';
import { setBufferFromFile } from '../actions/buffer';
import AudioEditor from '../components/AudioEditor';
import ExampleFileSelector from '../components/ExampleFileSelector';

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
      audioContext,
      buffer,
      name
    } = this.props;
    return (
      <div>
        <Row>
          <Col md={4}>
            <Jumbotron style={{padding: 20}}>
              <h4>Audio Editor</h4>
              You can drag-and-drop an audio file onto the window, choose from
              an example file below, or use the open file button to select a
              file to open from your computer.
              <hr />
              <Row>
                <Col md={12}>
                  <Input
                    ref="fileButtonContainer"
                    type="file"
                    wrapperClassName="btn-file"
                    label="Select a file from your computer"
                    onChange={this.handleFileSelect.bind(this)}
                  />
                  <Button
                    bsStyle="primary"
                    style={{width: '100%'}}
                    onClick={this.handleFileButtonClick.bind(this)}>
                    <Glyphicon glyph="folder-open" />
                    &nbsp;&nbsp;
                    Choose Local File
                  </Button>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={12}>
                  <label className="control-label">
                    Select an example file
                  </label>
                </Col>
              </Row>
              <ExampleFileSelector />
              <div>&nbsp;</div>
              <Table striped bordered condensed hover>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{name}</td>
                  </tr>
                  <tr>
                    <th>Sample Rate</th>
                    <td>{buffer.sampleRate}</td>
                  </tr>
                  <tr>
                    <th># of channels</th>
                    <td>{buffer.numberOfChannels}</td>
                  </tr>
                  <tr>
                    <th># of samples</th>
                    <td>{buffer.length}</td>
                  </tr>
                  <tr>
                    <th>Duration</th>
                    <td>{humanizeDuration(Math.round(buffer.duration * 1000))}</td>
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
    name: state.name
  };
})(Editor);
