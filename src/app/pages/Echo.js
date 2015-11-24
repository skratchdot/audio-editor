import React, { Component } from 'react';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router';
const packageInfo = require('../../package.json');

class Echo extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col md={6}>
            <Jumbotron className="text-center">
              <h4>Echo:</h4>
              {this.props.params.echo}
            </Jumbotron>
          </Col>
          <Col md={6}>
            <Jumbotron className="text-center">
              <h4>Path:</h4>
              {this.props.route.path}
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Jumbotron className="text-center">
              <h4>Example Links:</h4>
              <Link to={`/${packageInfo.name}/echo/hello`}>hello</Link>
              <br />
              <Link to={`/${packageInfo.name}/echo/test`}>test</Link>
            </Jumbotron>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Echo;
