import * as lib from 'stats-collector';
import getDefaultData from '../defaults/waveformData';

self.onmessage = function (e) {
  const forceRenderTime = 200;
  const startTime = Date.now();
  let lastRender = startTime;
  const { size, buffer } = e.data;
  const negCollectors = [];
  const posCollectors = [];
  const itemsPerBucket = buffer.length / size;
  const emit = function (isFinished) {
    if (isFinished || Date.now() - lastRender > forceRenderTime) {
      const result = getDefaultData();
      for (let i = 0; i < size; i++) {
        const neg = negCollectors[i].get(true);
        const pos = posCollectors[i].get(true);
        result.posMin.push(pos.min);
        result.posAvg.push(pos.mean);
        result.posMax.push(pos.max);
        result.negMin.push(neg.min);
        result.negAvg.push(neg.mean);
        result.negMax.push(neg.max);
      }
      result.renderTime = Date.now() - startTime;
      self.postMessage(result);
      lastRender = Date.now();
    }
  };
  let val;
  let bufferIndex = 0;
  let collectorIndex = 0;
  let loopIndex = 0;
  let skipIndex = 0;
  const skipFactor = Math.round(buffer.length / size);
  while (bufferIndex < buffer.length) {
    for (let i = 0; i < size; i++) {
      if (bufferIndex < buffer.length) {
        if (negCollectors.length <= i) {
          negCollectors[i] = new lib.BasicStatsCollector();
          posCollectors[i] = new lib.BasicStatsCollector();
        }
        //skipIndex = bufferIndex;
        skipIndex = (i * skipFactor) + loopIndex;
        collectorIndex = Math.floor(skipIndex / itemsPerBucket);

        val = buffer[skipIndex];
        if (val < 0) {
          negCollectors[collectorIndex].update(val);
        } else if (val > 0) {
          posCollectors[collectorIndex].update(val);
        }
        bufferIndex++;
      } else {
        break;
      }
    }
    loopIndex++;
    emit(false);
  }
  emit(true);
};
