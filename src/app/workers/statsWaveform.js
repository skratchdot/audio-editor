import AudioStats from '../../lib/AudioStats';
import BucketStats from '../../lib/BucketStats';

self.onmessage = function (e) {
  const { token, zoomLevel, start, end, channels } = e.data;
  const startTime = Date.now();
  let bucketSize = e.data.bucketSize || 1;
  let forceEmitTime = e.data.forceEmitTime || 0;
  let lastEmit = startTime;
  const audioLength = end - start;
  bucketSize = Math.min(audioLength, bucketSize);
  const renderSize = Math.pow(2, 16);
  const itemsPerRender = audioLength / renderSize;
  const numberOfChannels = channels.length;
  let mainStart = start;
  const mainEnd = end;
  const stats = {
    mono: new BucketStats(bucketSize, audioLength, AudioStats),
    channels: []
  };
  for (let channelNum = 0; channelNum < numberOfChannels; channelNum++) {
    stats.channels.push(new BucketStats(bucketSize, audioLength, AudioStats));
  }
  const emit = function (isFinished) {
    if (isFinished || (
      forceEmitTime > 0 &&
      Date.now() - lastEmit > forceEmitTime)) {
      const message = {
        token: token,
        isFinished: isFinished,
        zoomLevel: zoomLevel,
        start: start,
        end: end,
        mono: [],
        channels: []
      };
      message.mono = stats.mono.get(true);
      for (let channelNum = 0; channelNum < numberOfChannels; channelNum++) {
        message.channels[channelNum] = stats.channels[channelNum].get(true);
      }
      message.renderTime = Date.now() - startTime;
      self.postMessage(message);
      lastEmit = Date.now();
    }
  };
  let outerIndex = 0;
  while (mainStart < mainEnd) {
    for (let bucketIndex = 0; bucketIndex < renderSize; bucketIndex++) {
      const audioIndex = Math.floor(itemsPerRender * bucketIndex) + outerIndex;
      //const audioIndex = mainStart; // render in order
      if (audioIndex < channels[0].length) {
        let monoValue = 0;
        for (let channelNum = 0; channelNum < numberOfChannels; channelNum++) {
          const val = channels[channelNum][audioIndex];
          monoValue += val;
          stats.channels[channelNum].processAt(audioIndex, val);
        }
        stats.mono.processAt(audioIndex, monoValue / numberOfChannels);
      }
      mainStart++;
    }
    outerIndex++;
    emit(false);
  }
  emit(true);
  emit(true);
};

self.onerror = function (err) {
  /*eslint-disable */
  console.log('worker error: waveformData', err);
  /*eslint-enable */
};
