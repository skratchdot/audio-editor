import React, { Component } from 'react';
import { Row, Col, Input, Button, Glyphicon } from 'react-bootstrap';
import { setBufferFromUrl } from '../actions/buffer';
import { connect } from 'react-redux';
import * as examples from '../helpers/exampleFiles';

class ExampleFileSelector extends Component {
  constructor(props) {
    super(props);
    const group = examples.getRandomGroup();
    const file = examples.getRandomFile(group.key);
    this.state = {
      selectedGroup: group.key,
      selectedFile: file.file
    };
  }
  loadExampleFile(exampleFile) {
    const { dispatch } = this.props;
    const urlPrefix = 'http://projects.skratchdot.com/audio-files';
    dispatch(setBufferFromUrl(`${urlPrefix}${exampleFile}`));
  }
  loadSelectedExampleFile() {
    const selectedValue = this.refs.fileSelect.getValue();
    this.loadExampleFile(selectedValue);
  }
  handleRandomGroup() {
    const group = examples.getRandomGroup();
    const file = examples.getRandomFile(group.key);
    this.setState({
      selectedGroup: group.key,
      selectedFile: file.file
    });
    this.loadExampleFile(file.file);
  }
  handleRandomFile() {
    const file = examples.getRandomFile(this.state.selectedGroup);
    this.setState({
      selectedFile: file.file
    });
    this.loadExampleFile(file.file);
  }
  handleGroupChange(e) {
    this.setState({
      selectedGroup: e.target.value,
      selectedFile: null
    });
  }
  render() {
    const self = this;
    const groups = examples.getGroups();
    const files = examples.getFilesByGroup(self.state.selectedGroup);
		return (
      <div>
        <Row>
          <Col md={2}>
            <strong>Group:</strong>
          </Col>
          <Col md={10}>
            <Input type="select" style={{width: '100%'}}
              defaultValue={self.state.selectedGroup}
              onChange={self.handleGroupChange.bind(self)}>
              {groups.map(function (g) {
                return (
                  <option key={g.key} value={g.key}>
                    {g.name}
                  </option>
                );
              })}
            </Input>
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <strong>File:</strong>
          </Col>
          <Col md={10}>
            <Input ref="fileSelect" type="select" style={{width: '100%'}}
              defaultValue={self.state.selectedFile}
              onChange={self.loadSelectedExampleFile.bind(self)}>
              {files.map(function (f) {
                return (
                  <option key={f.file} value={f.file}>
                    {f.name}
                  </option>
                );
              })}
            </Input>
          </Col>
        </Row>
        <Row>
          <Col md={12} style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
            <Button bsStyle="primary"
              onClick={self.loadSelectedExampleFile.bind(self)}>
              <Glyphicon glyph="play" />
              &nbsp;
              Load Example
            </Button>
            <Button bsStyle="primary" onClick={self.handleRandomFile.bind(self)}>
              <Glyphicon glyph="random" />
              &nbsp;
              File
            </Button>
            <Button bsStyle="primary" onClick={self.handleRandomGroup.bind(self)}>
              <Glyphicon glyph="random" />
              &nbsp;
              Group
            </Button>
          </Col>
        </Row>
      </div>
		);
	}
}

export default connect(function (state) {
  return {
    buffer: state.buffer,
    zoom: state.zoom
  };
})(ExampleFileSelector);
