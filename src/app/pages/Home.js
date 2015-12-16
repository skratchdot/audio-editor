import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import { connect } from 'react-redux';

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
            This is currently a work-in-progress, and not yet
            complete.  It is being actively developed, and you
            can log feature requests on the
            &nbsp;
            <a href="https://github.com/skratchdot/audio-editor/issues">
              Github Issues Page.
            </a>
          </p>
        </Jumbotron>
      </div>
    );
  }
}

export default connect()(Home);
