
export function getWaveformDataSchema() {
  return {
    size: 1024,
    renderTime: 0,
    posMin: [],
    posMax: [],
    posAvg: [],
    negMin: [],
    negMax: [],
    negAvg: []
  };
}

export default function getDefaultData() {
  return {
    zoom: getWaveformDataSchema(),
    overview: getWaveformDataSchema()
  };
}
