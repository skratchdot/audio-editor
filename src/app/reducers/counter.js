import { INCREMENT_COUNTER, SET_COUNTER } from '../actions/counter';

export default function counter(state = 0, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + action.value;
    case SET_COUNTER:
      return action.value;
    default:
      return state;
  }
}
