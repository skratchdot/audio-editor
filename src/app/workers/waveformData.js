import * as lib from 'stats-collector';
import getDefaultData from '../defaults/waveformData';

self.onmessage = function (e) {
  const { size, buffer } = e.data;
  const result = getDefaultData();
  const negCollectors = [];
  const posCollectors = [];
  const itemsPerBucket = buffer.length / size;
  let index;
  let val;
  for (let i = 0; i < size; i++) {
    negCollectors[i] = new lib.BasicStatsCollector();
    posCollectors[i] = new lib.BasicStatsCollector();
  }
  for (let i = 0; i < buffer.length; i++) {
    index = Math.floor(i / itemsPerBucket);
    val = buffer[i];
    if (val < 0) {
      negCollectors[index].update(val);
    } else if (val > 0) {
      posCollectors[index].update(val);
    }
  }
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
  self.postMessage(result);
};
