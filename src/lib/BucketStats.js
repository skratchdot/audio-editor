import * as lib from 'stats-collector';

export default class BucketStats extends lib.BaseStats {
  constructor(numBuckets, expectedSize, clazz) {
    super();
    this.__index = 0;
    this.__buckets = [];
    this.__numBuckets = numBuckets;
    this.__expectedSize = expectedSize;
    this.__clazz = clazz;
    this.reset();
  }
  get(zeroForUndefined) {
    const result = [];
    for (let i = 0; i < this.__numBuckets; i++) {
      result.push(this.__buckets[i].get(zeroForUndefined));
    }
    return result;
  }
  processAt(index, value) {
    const ratio = index / this.__expectedSize;
    const newIndex = Math.floor(ratio * this.__numBuckets);
    const bucketIndex = newIndex % this.__numBuckets;
    this.__buckets[bucketIndex].process(value);
  }
  process(value) {
    this.processAt(this.__index, value);
    this.__index++;
  }
  reset() {
    this.__index = 0;
    this.__buckets = [];
    for (let i = 0; i < this.__numBuckets; i++) {
      this.__buckets.push(new this.__clazz());
    }
  }
}
