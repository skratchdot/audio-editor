import { getWaveformDataSchema } from '../defaults/waveformData';

self.onmessage = function (e) {
  const forceRenderTime = 100;
  const startTime = Date.now();
  let lastRender = startTime;
  const { size, buffer, start, end } = e.data;
  let newBufferLength = end - start;
  let dataSize = Math.min(size, newBufferLength);
  dataSize = Math.max(dataSize, 1);
  newBufferLength = Math.max(newBufferLength, 0);
  const negCollectors = [];
  const posCollectors = [];
  const itemsPerBucket = newBufferLength / dataSize;
  const emit = function (isFinished) {
    if (isFinished || Date.now() - lastRender > forceRenderTime) {
      const result = getWaveformDataSchema();
      for (let i = 0; i < negCollectors.length; i++) {
        const neg = negCollectors[i];
        const pos = posCollectors[i];
        result.posMin.push(pos.min || 0);
        result.posAvg.push(pos.sum / (pos.count || 1));
        result.posMax.push(pos.max || 0);
        result.negMin.push((0 - neg.min) || 0);
        result.negAvg.push(0 - (neg.sum / (neg.count || 1)));
        result.negMax.push((0 - neg.max) || 0);
      }
      result.renderTime = Date.now() - startTime;
      self.postMessage(result);
      lastRender = Date.now();
    }
  };
  let val;
  let bufferIndex = start;
  let loopIndex = 0;
  let skipIndex = 0;
  let collectorIndex = 0;
  const skipFactor = Math.ceil(newBufferLength / dataSize);
  for (let i = 0; i < dataSize; i++) {
    negCollectors[i] = {
      count: 0,
      sum: 0,
      min: null,
      max: null
    };
    posCollectors[i] = {
      count: 0,
      sum: 0,
      min: null,
      max: null
    };
  }
  try {
    while (bufferIndex < newBufferLength) {
      for (let i = 0; i < dataSize; i++) {
        if (bufferIndex < newBufferLength) {
          //skipIndex = bufferIndex;
          skipIndex = (i * skipFactor) + loopIndex;
          collectorIndex = Math.floor(skipIndex / itemsPerBucket) % dataSize;
          val = buffer[skipIndex];
          if (val < 0) {
            val = Math.abs(val);
            negCollectors[collectorIndex].count++;
            negCollectors[collectorIndex].sum += val;
            if (val < negCollectors[collectorIndex].min) {
              negCollectors[collectorIndex].min = val;
            }
            if (val > negCollectors[collectorIndex].max) {
              negCollectors[collectorIndex].max = val;
            }
          } else if (val > 0) {
            posCollectors[collectorIndex].count++;
            posCollectors[collectorIndex].sum += val;
            if (val < posCollectors[collectorIndex].min) {
              posCollectors[collectorIndex].min = val;
            }
            if (val > posCollectors[collectorIndex].max) {
              posCollectors[collectorIndex].max = val;
            }
          }
          bufferIndex++;
        } else {
          break;
        }
      }
      loopIndex++;
      emit(false);
    }
  } catch (e) {
    /*eslint-disable */
    console.log(e, collectorIndex);
    /*eslint-enable */
    throw e;
  }
  emit(true);
  self.close();
};
