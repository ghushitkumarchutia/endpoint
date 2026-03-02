const MAX_ARRAY_SIZE = 100000;

const sanitizeArray = (values, maxSize = MAX_ARRAY_SIZE) => {
  if (!Array.isArray(values) || values.length === 0) return [];
  const limited = values.length > maxSize ? values.slice(0, maxSize) : values;
  return limited
    .map((v) => (typeof v === "number" ? v : Number(v)))
    .filter((v) => isFinite(v) && !isNaN(v));
};

const sanitizeNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isFinite(num) && !isNaN(num) ? num : defaultValue;
};

export const calculateMean = (values) => {
  const clean = sanitizeArray(values);
  if (clean.length === 0) return 0;
  let sum = 0;
  let compensation = 0;

  for (const val of clean) {
    const y = val - compensation;
    const t = sum + y;
    compensation = t - sum - y;
    sum = t;
  }

  return sum / clean.length;
};

/**
 * Calculate median value
 * @param {number[]} values - Array of numbers
 * @returns {number} - Median value
 */
export const calculateMedian = (values) => {
  const clean = sanitizeArray(values);
  if (clean.length === 0) return 0;

  const sorted = [...clean].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * Calculate percentile value
 * @param {number[]} values - Array of numbers
 * @param {number} percentile - Percentile (0-100)
 * @returns {number} - Percentile value
 */
export const calculatePercentile = (values, percentile) => {
  const clean = sanitizeArray(values);
  if (clean.length === 0) return 0;

  // Clamp percentile to valid range
  const p = Math.max(0, Math.min(100, sanitizeNumber(percentile, 50)));

  const sorted = [...clean].sort((a, b) => a - b);

  // Linear interpolation for more accurate percentile
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) return sorted[lower];

  const fraction = index - lower;
  return sorted[lower] * (1 - fraction) + sorted[upper] * fraction;
};

/**
 * Calculate standard deviation
 * @param {number[]} values - Array of numbers
 * @param {number|null} precomputedMean - Optional precomputed mean
 * @returns {number} - Standard deviation
 */
export const calculateStdDev = (values, precomputedMean = null) => {
  const clean = sanitizeArray(values);
  if (clean.length < 2) return 0;

  const mean =
    precomputedMean !== null ? precomputedMean : calculateMean(clean);

  // Use Welford's online algorithm for numerical stability
  let m2 = 0;
  for (const val of clean) {
    const delta = val - mean;
    m2 += delta * delta;
  }

  // Population standard deviation
  return Math.sqrt(m2 / clean.length);
};

/**
 * Calculate variance
 * @param {number[]} values - Array of numbers
 * @returns {number} - Variance
 */
export const calculateVariance = (values) => {
  const stdDev = calculateStdDev(values);
  return stdDev * stdDev;
};

/**
 * Calculate success rate percentage
 * @param {number} total - Total count
 * @param {number} failures - Failure count
 * @returns {number} - Success rate (0-100)
 */
export const calculateSuccessRate = (total, failures) => {
  const safeTotal = sanitizeNumber(total, 0);
  const safeFailures = sanitizeNumber(failures, 0);

  if (safeTotal <= 0) return 100;
  if (safeFailures < 0) return 100;
  if (safeFailures >= safeTotal) return 0;

  return ((safeTotal - safeFailures) / safeTotal) * 100;
};

/**
 * Calculate uptime percentage from check results
 * @param {Array} checks - Array of check objects with success property
 * @returns {number} - Uptime percentage (0-100)
 */
export const calculateUptime = (checks) => {
  if (!Array.isArray(checks) || checks.length === 0) return 100;

  // Limit to reasonable size
  const limited =
    checks.length > MAX_ARRAY_SIZE ? checks.slice(-MAX_ARRAY_SIZE) : checks;

  let successful = 0;
  let total = 0;

  for (const check of limited) {
    if (check && typeof check === "object") {
      total++;
      if (check.success === true || check.status === "success") {
        successful++;
      }
    }
  }

  return total === 0 ? 100 : (successful / total) * 100;
};

/**
 * Calculate percentage trend/change
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} - Percentage change
 */
export const calculateTrend = (current, previous) => {
  const safeCurrent = sanitizeNumber(current, 0);
  const safePrevious = sanitizeNumber(previous, 0);

  if (safePrevious === 0) {
    // Handle division by zero
    return safeCurrent === 0 ? 0 : safeCurrent > 0 ? 100 : -100;
  }

  return ((safeCurrent - safePrevious) / Math.abs(safePrevious)) * 100;
};

/**
 * Calculate moving average
 * @param {number[]} values - Array of numbers
 * @param {number} windowSize - Window size for moving average
 * @returns {number[]} - Array of moving averages
 */
export const calculateMovingAverage = (values, windowSize = 5) => {
  const clean = sanitizeArray(values);
  if (clean.length === 0) return [];

  const window = Math.max(
    1,
    Math.min(clean.length, sanitizeNumber(windowSize, 5)),
  );
  const result = [];

  for (let i = 0; i < clean.length; i++) {
    const start = Math.max(0, i - window + 1);
    const windowSlice = clean.slice(start, i + 1);
    result.push(calculateMean(windowSlice));
  }

  return result;
};

/**
 * Aggregate data by time period
 * @param {Array} data - Array of data objects
 * @param {string} periodKey - Key to group by (default: "date")
 * @returns {Array} - Aggregated data
 */
export const aggregateByPeriod = (data, periodKey = "date") => {
  if (!Array.isArray(data) || data.length === 0) return [];

  // Sanitize period key to prevent prototype pollution
  const safeKey = String(periodKey).replace(/[^a-zA-Z0-9_]/g, "") || "date";

  const grouped = new Map();

  for (const item of data) {
    if (!item || typeof item !== "object") continue;

    const key = item[safeKey];
    if (key === undefined || key === null) continue;

    const keyStr = String(key);

    if (!grouped.has(keyStr)) {
      grouped.set(keyStr, { period: keyStr, values: [], count: 0 });
    }

    const group = grouped.get(keyStr);
    const value = sanitizeNumber(
      item.value ?? item.responseTime ?? item.cost,
      null,
    );

    if (value !== null) {
      group.values.push(value);
    }
    group.count++;
  }

  return Array.from(grouped.values()).map((group) => ({
    [safeKey]: group.period,
    avg: calculateMean(group.values),
    min: group.values.length > 0 ? Math.min(...group.values) : 0,
    max: group.values.length > 0 ? Math.max(...group.values) : 0,
    count: group.count,
  }));
};

/**
 * Calculate z-score for anomaly detection
 * @param {number} value - Value to check
 * @param {number} mean - Population mean
 * @param {number} stdDev - Population standard deviation
 * @returns {number} - Z-score
 */
export const calculateZScore = (value, mean, stdDev) => {
  const safeValue = sanitizeNumber(value, 0);
  const safeMean = sanitizeNumber(mean, 0);
  const safeStdDev = sanitizeNumber(stdDev, 1);

  if (safeStdDev === 0) return 0;

  return (safeValue - safeMean) / safeStdDev;
};

/**
 * Detect outliers using IQR method
 * @param {number[]} values - Array of numbers
 * @returns {Object} - Object with outliers and bounds
 */
export const detectOutliers = (values) => {
  const clean = sanitizeArray(values);
  if (clean.length < 4) return { outliers: [], lower: 0, upper: 0 };

  const q1 = calculatePercentile(clean, 25);
  const q3 = calculatePercentile(clean, 75);
  const iqr = q3 - q1;

  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return {
    outliers: clean.filter((v) => v < lowerBound || v > upperBound),
    lower: lowerBound,
    upper: upperBound,
  };
};
