import AudioStats from '../../lib/AudioStats';

self.onmessage = function (e) {
  const startRenderTime = Date.now();
  const forceRenderTime = 100;
  let lastRenderTime = startRenderTime;
  const { token, key, bucketSize, channels, start, end, forceRender } = e.data;
  const numberOfChannels = channels.length;
  let newBufferLength = end - start;
  let numBuckets = Math.min(bucketSize, newBufferLength);
  numBuckets = Math.max(numBuckets, 1);
  newBufferLength = Math.max(newBufferLength, 0);
  const buckets = [];
  const itemsPerBucket = newBufferLength / numBuckets;
  let mainLoopIndex = start;
  const mainLoopEnd = start + newBufferLength;
  const emit = function (isFinished) {
    if (isFinished ||
      (forceRender && Date.now() - lastRenderTime > forceRenderTime)) {
      let obj;
      const result = {
        isFinished: isFinished,
        token: token,
        key: key,
        bucketSize: bucketSize,
        start: start,
        end: end,
        statsMono: [],
        pathsPosMaxMono: 'M 0,0',
        pathsPosAvgMono: 'M 0,0',
        pathsNegAvgMono: 'M 0,0',
        pathsNegMinMono: 'M 0,0'
      };
      for (let channelNum = 0; channelNum < numberOfChannels; channelNum++) {
        result[`statsChannel${channelNum}`] = [];
        result[`pathsPosMaxChannel${channelNum}`] = 'M 0,0';
        result[`pathsPosAvgChannel${channelNum}`] = 'M 0,0';
        result[`pathsNegAvgChannel${channelNum}`] = 'M 0,0';
        result[`pathsNegMinChannel${channelNum}`] = 'M 0,0';
      }
      for (let bucketIndex = 0; bucketIndex < buckets.length; bucketIndex++) {
        const xVal = start + Math.round(itemsPerBucket * bucketIndex);
        obj = buckets[bucketIndex].mono.get(true);
        result.statsMono.push(obj);
        result.pathsPosMaxMono += ` L ${xVal},${obj.pos.max}`;
        result.pathsPosAvgMono += ` L ${xVal},${obj.pos.mean}`;
        result.pathsNegAvgMono += ` L ${xVal},${obj.neg.mean}`;
        result.pathsNegMinMono += ` L ${xVal},${obj.neg.min}`;
        for (let channelNum = 0; channelNum < numberOfChannels; channelNum++) {
          obj = buckets[bucketIndex].channels[channelNum].get(true);
          result[`statsChannel${channelNum}`].push(obj);
          result[`pathsPosMaxChannel${channelNum}`] += ` L ${xVal},${obj.pos.max}`;
          result[`pathsPosAvgChannel${channelNum}`] += ` L ${xVal},${obj.pos.mean}`;
          result[`pathsNegAvgChannel${channelNum}`] += ` L ${xVal},${obj.neg.mean}`;
          result[`pathsNegMinChannel${channelNum}`] += ` L ${xVal},${obj.neg.min}`;
        }
      }
      // close paths
      result.pathsPosMaxMono += ` L ${mainLoopEnd},0 Z`;
      result.pathsPosAvgMono += ` L ${mainLoopEnd},0 Z`;
      result.pathsNegAvgMono += ` L ${mainLoopEnd},0 Z`;
      result.pathsNegMinMono += ` L ${mainLoopEnd},0 Z`;
      for (let channelNum = 0; channelNum < numberOfChannels; channelNum++) {
        result[`pathsPosMaxChannel${channelNum}`] += ` L ${mainLoopEnd},0 Z`;
        result[`pathsPosAvgChannel${channelNum}`] += ` L ${mainLoopEnd},0 Z`;
        result[`pathsNegAvgChannel${channelNum}`] += ` L ${mainLoopEnd},0 Z`;
        result[`pathsNegMinChannel${channelNum}`] += ` L ${mainLoopEnd},0 Z`;
      }
      // send result
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
    bucket.channels = [];
    for (let i = 0; i < numberOfChannels; i++) {
      bucket.channels.push(new AudioStats());
    }
    bucket.mono = new AudioStats();
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
      let monoValue = 0;
      for (let channelNum = 0; channelNum < numberOfChannels; channelNum++) {
        const channelValue = channels[channelNum][buckets[i].loopStart];
        monoValue += channelValue;
        buckets[i].channels[channelNum].process(channelValue);
      }
      buckets[i].mono.process(monoValue / numberOfChannels);
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
