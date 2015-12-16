import { getWaveformDataSchema } from '../defaults/waveformData';
import AudioStats from '../../lib/AudioStats';

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
        const stats = buckets[i].audio.get(true);
        result.posMin.push(stats.pos.min);
        result.posAvg.push(stats.pos.mean);
        result.posMax.push(stats.pos.max);
        result.negMin.push(stats.neg.min);
        result.negAvg.push(stats.neg.mean);
        result.negMax.push(stats.neg.max);
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
    const bucket = {};
    bucket.audio = new AudioStats();
    bucket.loopStart = loopStart;
    bucket.loopEnd = loopEnd;
    return bucket;
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
      const val = buffer[buckets[i].loopStart];
      buckets[i].audio.process(val);
      buckets[i].loopStart++;
      mainLoopIndex++;
    }
    emit(false);
  }
  emit(true);
};

self.onerror = function (err) {
  /*eslint-disable */
  console.log('worker error: waveformData', err);
  /*eslint-enable */
};
