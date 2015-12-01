import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';

class Home extends Component {
  render() {
    return (
      <div>
        <Jumbotron className="text-center">
          <h1 className="title">
            audio-editor
            <br />
            <small>An audio editor built with React</small>
          </h1>
          <p>
            This is an example home page
          </p>
        </Jumbotron>
      </div>
    );
  }
}

export default Home;
