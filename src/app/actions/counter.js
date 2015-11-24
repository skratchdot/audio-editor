export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const SET_COUNTER = 'SET_COUNTER';

export function increment(value) {
  return {
    type: INCREMENT_COUNTER,
    value: value
  };
}

export function set(value) {
  return {
    type: SET_COUNTER,
    value: value
  };
}

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment(1));
  };
}

export function incrementAsync(delay = 1000) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(increment(1));
    }, delay);
  };
}
