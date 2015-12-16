import * as lib from 'stats-collector';

export default class AudioStats extends lib.BaseStats {
  constructor() {
    super();
    this.reset();
  }
  get(zeroForUndefined) {
    return {
      neg: this.__neg.get(zeroForUndefined),
      pos: this.__pos.get(zeroForUndefined),
      all: this.__all.get(zeroForUndefined)
    };
  }
  process(value) {
    this.__neg.process(value);
    this.__pos.process(value);
    this.__all.process(value);
  }
  reset() {
    this.__neg = new lib.BasicNumberStats();
    this.__neg.addFilter(lib.filters.number.negative);
    this.__pos = new lib.BasicNumberStats();
    this.__pos.addFilter(lib.filters.number.positive);
    this.__all = new lib.BasicNumberStats();
  }
}
