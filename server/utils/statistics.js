function calculateMean(data) {
  if (!data || data.length === 0) return 0;
  return data.reduce((sum, val) => sum + val, 0) / data.length;
}

function calculateStdDev(data, mean = null) {
  if (!data || data.length < 2) return 0;
  const avg = mean !== null ? mean : calculateMean(data);
  const squaredDiffs = data.map((val) => Math.pow(val - avg, 2));
  return Math.sqrt(
    squaredDiffs.reduce((sum, val) => sum + val, 0) / (data.length - 1),
  );
}

function calculatePercentile(data, percentile) {
  if (!data || data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function welchTTest(sample1, sample2) {
  const n1 = sample1.length;
  const n2 = sample2.length;
  if (n1 < 2 || n2 < 2) {
    return { tStatistic: 0, pValue: 1, significant: false };
  }
  const mean1 = calculateMean(sample1);
  const mean2 = calculateMean(sample2);
  const var1 = Math.pow(calculateStdDev(sample1, mean1), 2);
  const var2 = Math.pow(calculateStdDev(sample2, mean2), 2);
  const se = Math.sqrt(var1 / n1 + var2 / n2);
  if (se === 0) {
    return { tStatistic: 0, pValue: 1, significant: false };
  }
  const tStatistic = (mean1 - mean2) / se;
  const df =
    Math.pow(var1 / n1 + var2 / n2, 2) /
    (Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1));
  const pValue = 2 * (1 - tDistributionCDF(Math.abs(tStatistic), df));
  return {
    tStatistic: Number(tStatistic.toFixed(4)),
    pValue: Number(pValue.toFixed(6)),
    degreesOfFreedom: Number(df.toFixed(2)),
    significant: pValue < 0.05,
  };
}

function tDistributionCDF(t, df) {
  const x = df / (df + t * t);
  return 1 - 0.5 * incompleteBeta(df / 2, 0.5, x);
}

function incompleteBeta(a, b, x) {
  if (x === 0) return 0;
  if (x === 1) return 1;
  const bt = Math.exp(
    logGamma(a + b) -
      logGamma(a) -
      logGamma(b) +
      a * Math.log(x) +
      b * Math.log(1 - x),
  );
  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betaContinuedFraction(a, b, x)) / a;
  }
  return 1 - (bt * betaContinuedFraction(b, a, 1 - x)) / b;
}

function betaContinuedFraction(a, b, x) {
  const maxIterations = 100;
  const epsilon = 1e-10;
  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < epsilon) d = epsilon;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= maxIterations; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < epsilon) d = epsilon;
    c = 1 + aa / c;
    if (Math.abs(c) < epsilon) c = epsilon;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d;
    if (Math.abs(d) < epsilon) d = epsilon;
    c = 1 + aa / c;
    if (Math.abs(c) < epsilon) c = epsilon;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < epsilon) break;
  }
  return h;
}

function logGamma(x) {
  const coefficients = [
    76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.001208650973866179, -0.000005395239384953,
  ];
  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) {
    ser += coefficients[j] / ++y;
  }
  return -tmp + Math.log((2.5066282746310005 * ser) / x);
}

function calculateConfidenceInterval(data, confidenceLevel = 0.95) {
  const n = data.length;
  if (n < 2) return { lower: 0, upper: 0, mean: 0, marginOfError: 0 };
  const mean = calculateMean(data);
  const stdDev = calculateStdDev(data, mean);
  const tValue = getTValue(n - 1, confidenceLevel);
  const marginOfError = tValue * (stdDev / Math.sqrt(n));
  return {
    lower: Number((mean - marginOfError).toFixed(4)),
    upper: Number((mean + marginOfError).toFixed(4)),
    mean: Number(mean.toFixed(4)),
    marginOfError: Number(marginOfError.toFixed(4)),
  };
}

function getTValue(df, confidenceLevel) {
  const tTable = {
    0.9: { 1: 6.314, 5: 2.015, 10: 1.812, 20: 1.725, 30: 1.697, 100: 1.66 },
    0.95: { 1: 12.706, 5: 2.571, 10: 2.228, 20: 2.086, 30: 2.042, 100: 1.984 },
    0.99: { 1: 63.657, 5: 4.032, 10: 3.169, 20: 2.845, 30: 2.75, 100: 2.626 },
  };
  const table = tTable[confidenceLevel] || tTable[0.95];
  const keys = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b);
  for (const key of keys) {
    if (df <= key) return table[key];
  }
  return table[100];
}

function detectOutliers(data, threshold = 2) {
  if (data.length < 3) return { outliers: [], cleaned: data };
  const mean = calculateMean(data);
  const stdDev = calculateStdDev(data, mean);
  const outliers = [];
  const cleaned = [];
  data.forEach((val, idx) => {
    const zScore = stdDev === 0 ? 0 : Math.abs((val - mean) / stdDev);
    if (zScore > threshold) {
      outliers.push({
        value: val,
        index: idx,
        zScore: Number(zScore.toFixed(2)),
      });
    } else {
      cleaned.push(val);
    }
  });
  return { outliers, cleaned };
}

module.exports = {
  calculateMean,
  calculateStdDev,
  calculatePercentile,
  welchTTest,
  calculateConfidenceInterval,
  detectOutliers,
};
