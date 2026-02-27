const {
  calculateMean,
  calculateStdDev,
  calculatePercentile,
  welchTTest,
  calculateConfidenceInterval,
  detectOutliers,
} = require("../../utils/statistics");

describe("statistics", () => {
  describe("calculateMean", () => {
    it("returns 0 for empty array", () => {
      expect(calculateMean([])).toBe(0);
    });

    it("returns 0 for null", () => {
      expect(calculateMean(null)).toBe(0);
    });

    it("calculates mean correctly", () => {
      expect(calculateMean([10, 20, 30])).toBe(20);
    });

    it("handles single value", () => {
      expect(calculateMean([7])).toBe(7);
    });
  });

  describe("calculateStdDev", () => {
    it("returns 0 for fewer than 2 values", () => {
      expect(calculateStdDev([])).toBe(0);
      expect(calculateStdDev([5])).toBe(0);
      expect(calculateStdDev(null)).toBe(0);
    });

    it("returns 0 for identical values", () => {
      expect(calculateStdDev([3, 3, 3])).toBe(0);
    });

    it("uses sample standard deviation (n-1)", () => {
      const result = calculateStdDev([2, 4, 4, 4, 5, 5, 7, 9]);
      expect(result).toBeCloseTo(2.138, 2);
    });

    it("accepts pre-calculated mean", () => {
      const data = [10, 20, 30];
      const mean = 20;
      const result = calculateStdDev(data, mean);
      expect(result).toBe(calculateStdDev(data));
    });
  });

  describe("calculatePercentile (interpolated)", () => {
    it("returns 0 for empty array", () => {
      expect(calculatePercentile([], 50)).toBe(0);
    });

    it("calculates P50 correctly", () => {
      const result = calculatePercentile([1, 2, 3, 4, 5], 50);
      expect(result).toBe(3);
    });

    it("calculates P25 with interpolation", () => {
      const result = calculatePercentile([1, 2, 3, 4, 5], 25);
      expect(result).toBe(2);
    });

    it("does not mutate original array", () => {
      const arr = [5, 3, 1, 4, 2];
      calculatePercentile(arr, 50);
      expect(arr).toEqual([5, 3, 1, 4, 2]);
    });
  });

  describe("welchTTest", () => {
    it("returns non-significant for identical samples", () => {
      const result = welchTTest([5, 5, 5, 5], [5, 5, 5, 5]);
      expect(result.significant).toBe(false);
      expect(result.pValue).toBe(1);
    });

    it("returns non-significant for small samples", () => {
      const result = welchTTest([1], [2]);
      expect(result.significant).toBe(false);
    });

    it("detects significant difference", () => {
      const sample1 = [100, 102, 98, 101, 99, 100, 103, 97, 101, 100];
      const sample2 = [200, 198, 202, 199, 201, 200, 203, 197, 201, 200];
      const result = welchTTest(sample1, sample2);
      expect(result.significant).toBe(true);
      expect(result.pValue).toBeLessThan(0.05);
      expect(result).toHaveProperty("tStatistic");
      expect(result).toHaveProperty("degreesOfFreedom");
    });
  });

  describe("calculateConfidenceInterval", () => {
    it("returns zeros for fewer than 2 values", () => {
      const result = calculateConfidenceInterval([5]);
      expect(result).toEqual({ lower: 0, upper: 0, mean: 0, marginOfError: 0 });
    });

    it("calculates 95% CI correctly", () => {
      const data = [100, 102, 98, 101, 99, 100, 103, 97, 101, 100];
      const result = calculateConfidenceInterval(data, 0.95);
      expect(result.mean).toBeCloseTo(100.1, 1);
      expect(result.lower).toBeLessThan(result.mean);
      expect(result.upper).toBeGreaterThan(result.mean);
      expect(result.marginOfError).toBeGreaterThan(0);
    });
  });

  describe("detectOutliers", () => {
    it("returns empty for fewer than 3 values", () => {
      const result = detectOutliers([1, 2]);
      expect(result.outliers).toHaveLength(0);
      expect(result.cleaned).toEqual([1, 2]);
    });

    it("detects extreme outliers", () => {
      const data = [10, 11, 10, 12, 11, 10, 11, 100];
      const result = detectOutliers(data, 2);
      expect(result.outliers.length).toBeGreaterThan(0);
      expect(result.outliers[0].value).toBe(100);
      expect(result.outliers[0]).toHaveProperty("zScore");
      expect(result.cleaned).not.toContain(100);
    });

    it("handles all identical values without error", () => {
      const result = detectOutliers([5, 5, 5, 5, 5]);
      expect(result.outliers).toHaveLength(0);
      expect(result.cleaned).toEqual([5, 5, 5, 5, 5]);
    });
  });
});
