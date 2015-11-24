import React, { Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { connect } from 'react-redux';
import { increment, set } from '../actions/counter';

class Counter extends Component {
  render() {
    const { dispatch, counter } = this.props;
    return (
      <div>
        <Jumbotron className="text-center">
          <h1 className="title">
            Redux Counter Example:
          </h1>
          <h2>
            Current Value: <strong>{counter}</strong>
          </h2>
          <div>
            <Button onClick={() => dispatch(increment(-10))}>Decrement By 10</Button>
            <Button onClick={() => dispatch(increment(-1))}>Decrement By 1</Button>
            <Button onClick={() => dispatch(set(0))}>Set To 0</Button>
            <Button onClick={() => dispatch(increment(1))}>Increment By 1</Button>
            <Button onClick={() => dispatch(increment(10))}>Increment By 10</Button>
          </div>
        </Jumbotron>
      </div>
    );
  }
}

export default connect(function (state) {
  return {
    counter: state.counter
  };
})(Counter);
