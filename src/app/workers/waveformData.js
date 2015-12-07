import { getWaveformDataSchema } from '../defaults/waveformData';

self.onmessage = function (e) {
  const startRenderTime = Date.now();
  const forceRenderTime = 100;
  let lastRenderTime = startRenderTime;
  const { size, buffer, start, end } = e.data;
  let newBufferLength = end - start;
  let numBuckets = Math.min(size, newBufferLength);
  numBuckets = Math.max(numBuckets, 1);
  newBufferLength = Math.max(newBufferLength, 0);
  const buckets = [];
  const itemsPerBucket = newBufferLength / numBuckets;
  let mainLoopIndex = start;
  const mainLoopEnd = start + newBufferLength;
  const emit = function (isFinished) {
    if (isFinished || Date.now() - lastRenderTime > forceRenderTime) {
      const result = getWaveformDataSchema();
      for (let i = 0; i < buckets.length; i++) {
        const neg = buckets[i].neg;
        const pos = buckets[i].pos;
        result.posMin.push(pos.min || 0);
        result.posAvg.push(pos.sum / (pos.count || 1));
        result.posMax.push(pos.max || 0);
        result.negMin.push((0 - neg.min) || 0);
        result.negAvg.push(0 - (neg.sum / (neg.count || 1)));
        result.negMax.push((0 - neg.max) || 0);
      }
      result.renderTime = Date.now() - startRenderTime;
      self.postMessage(result);
      lastRenderTime = Date.now();
    }
    if (isFinished) {
      self.close();
    }
  };
  const initBucket = function (loopStart, loopEnd) {
    return {
      neg: {
        count: 0,
        sum: 0,
        min: null,
        max: null
      },
      pos: {
        count: 0,
        sum: 0,
        min: null,
        max: null
      },
      loopStart: loopStart,
      loopEnd: loopEnd
    };
  };
  const updateBucket = function (obj, key, val) {
    obj[key].count++;
    obj[key].sum += val;
    if (val < obj[key].min) {
      obj[key].min = val;
    }
    if (val > obj[key].max) {
      obj[key].max = val;
    }
    return obj;
  };
  // create buckets
  let loopStart = mainLoopIndex;
  for (let i = 0; i < numBuckets; i++) {
    const loopEnd = loopStart + itemsPerBucket;
    buckets[i] = initBucket(Math.round(loopStart), loopEnd);
    loopStart += itemsPerBucket;
  }
  while (mainLoopIndex < mainLoopEnd) {
    for (let i = 0; i < numBuckets; i++) {
      let val = buffer[buckets[i].loopStart];
      if (val < 0) {
        val = Math.abs(val);
        buckets[i] = updateBucket(buckets[i], 'neg', val);
      } else if (val > 0) {
        buckets[i] = updateBucket(buckets[i], 'pos', val);
      }
      buckets[i].loopStart++;
      mainLoopIndex++;
    }
    emit(false);
  }
  emit(true);
};

self.onerror = function (err) {
  console.log('worker error: waveformData', err);
};
