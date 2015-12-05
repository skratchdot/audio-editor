import React, { Component } from 'react';
import { Row, Col, Input, Button, Glyphicon } from 'react-bootstrap';
import {
  loadExampleFile,
  setExamples,
  setRandomGroupAndFile,
  setRandomFile
} from '../actions/examples';
import { connect } from 'react-redux';
import random from 'lodash.random';
import akwf from '../examples/akwf.json';
import loops from '../examples/loops.json';
import virus from '../examples/virus.json';
import waves from '../examples/waves.json';

const groupData = {
  akwf: akwf,
  loops: loops,
  virus: virus,
  waves: waves
};

export function getRandomGroup() {
  const groups = getGroups();
  return groups[random(groups.length - 1)];
}

export function getRandomFile(groupKey) {
  const files = getFilesByGroup(groupKey);
  return files[random(files.length - 1)];
}

export function getGroups() {
  return [
    { key: 'akwf', name: 'Adventure Kid Waveforms'},
    { key: 'loops', name: 'Loops'},
    { key: 'waves', name: 'Test Wave Files'},
    { key: 'virus', name: 'Virus Waveforms'}
  ];
}

export function getFilesByGroup(groupKey) {
  return groupData[groupKey] || [];
}

class ExampleFileSelector extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setRandomGroupAndFile(false));
  }
  loadSelectedExampleFile() {
    const { dispatch } = this.props;
    const selectedValue = this.refs.fileSelect.getValue();
    dispatch(loadExampleFile(selectedValue));
  }
  render() {
    const { dispatch, examples } = this.props;
    const self = this;
    const groups = getGroups();
    const files = getFilesByGroup(examples.group);
		return (
      <div>
        <Row>
          <Col md={2}>
            <strong>Group:</strong>
          </Col>
          <Col md={10}>
            <Input type="select" style={{width: '100%'}}
              onChange={(e) => {
                dispatch(setExamples(e.target.value, null));
              }}>
              {groups.map(function (g) {
                return (
                  <option key={g.key} value={g.key}
                    selected={g.key === examples.group}>
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
              onChange={self.loadSelectedExampleFile.bind(self)}>
              {files.map(function (f) {
                return (
                  <option key={f[0]} value={f[0]}
                    selected={f[0] === examples.file}>
                    {f[1]}
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
            <Button bsStyle="primary" onClick={() => {
                dispatch(setRandomFile());
              }}>
              <Glyphicon glyph="random" />
              &nbsp;
              File
            </Button>
            <Button bsStyle="primary" onClick={() => {
                dispatch(setRandomGroupAndFile());
              }}>
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
    examples: state.examples
  };
})(ExampleFileSelector);
