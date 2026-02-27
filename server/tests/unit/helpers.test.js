const {
  calculateAverage,
  calculateStdDev,
  sanitizeObject,
  calculatePercentile,
  formatResponseTime,
  generateRandomString,
  isValidUrl,
  truncateString,
  generateResetToken,
} = require("../../utils/helpers");

describe("helpers", () => {
  describe("calculateAverage", () => {
    it("returns average of values", () => {
      expect(calculateAverage([10, 20, 30])).toBe(20);
    });

    it("returns 0 for empty array", () => {
      expect(calculateAverage([])).toBe(0);
    });

    it("returns 0 for null input", () => {
      expect(calculateAverage(null)).toBe(0);
    });

    it("handles single value", () => {
      expect(calculateAverage([42])).toBe(42);
    });

    it("handles decimal values", () => {
      expect(calculateAverage([1.5, 2.5])).toBe(2);
    });
  });

  describe("calculateStdDev", () => {
    it("returns 0 for fewer than 2 values", () => {
      expect(calculateStdDev([5])).toBe(0);
      expect(calculateStdDev([])).toBe(0);
      expect(calculateStdDev(null)).toBe(0);
    });

    it("returns 0 for identical values", () => {
      expect(calculateStdDev([5, 5, 5])).toBe(0);
    });

    it("calculates standard deviation correctly", () => {
      const result = calculateStdDev([2, 4, 4, 4, 5, 5, 7, 9]);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(3);
    });
  });

  describe("calculatePercentile", () => {
    it("returns 0 for empty array", () => {
      expect(calculatePercentile([], 50)).toBe(0);
    });

    it("returns correct P50 (median)", () => {
      expect(calculatePercentile([1, 2, 3, 4, 5], 50)).toBe(3);
    });

    it("returns max value for P99", () => {
      const result = calculatePercentile([100, 200, 300, 400, 500], 99);
      expect(result).toBe(500);
    });

    it("does not mutate original array", () => {
      const arr = [5, 3, 1, 4, 2];
      calculatePercentile(arr, 50);
      expect(arr).toEqual([5, 3, 1, 4, 2]);
    });
  });

  describe("formatResponseTime", () => {
    it("formats milliseconds under 1s", () => {
      expect(formatResponseTime(500)).toBe("500ms");
    });

    it("formats seconds for 1000ms and above", () => {
      expect(formatResponseTime(1000)).toBe("1.00s");
    });

    it("formats with 2 decimal places", () => {
      expect(formatResponseTime(2345)).toBe("2.35s");
    });
  });

  describe("generateRandomString", () => {
    it("generates string of default length 16", () => {
      const result = generateRandomString();
      expect(result).toHaveLength(16);
    });

    it("generates string of custom length", () => {
      const result = generateRandomString(32);
      expect(result).toHaveLength(32);
    });

    it("generates unique strings each call", () => {
      const a = generateRandomString();
      const b = generateRandomString();
      expect(a).not.toBe(b);
    });
  });

  describe("generateResetToken", () => {
    it("generates a 64-character hex string", () => {
      const token = generateResetToken();
      expect(token).toHaveLength(64);
      expect(token).toMatch(/^[a-f0-9]+$/);
    });
  });

  describe("isValidUrl", () => {
    it("returns true for http URLs", () => {
      expect(isValidUrl("http://example.com")).toBe(true);
    });

    it("returns true for https URLs", () => {
      expect(isValidUrl("https://api.example.com/v1")).toBe(true);
    });

    it("returns false for ftp URLs", () => {
      expect(isValidUrl("ftp://example.com")).toBe(false);
    });

    it("returns false for invalid strings", () => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("")).toBe(false);
    });
  });

  describe("truncateString", () => {
    it("returns original if under maxLength", () => {
      expect(truncateString("hello", 10)).toBe("hello");
    });

    it("truncates and adds ellipsis", () => {
      expect(truncateString("hello world", 5)).toBe("hello...");
    });

    it("handles null/undefined", () => {
      expect(truncateString(null)).toBeNull();
      expect(truncateString(undefined)).toBeUndefined();
    });
  });

  describe("sanitizeObject", () => {
    it("replaces dots and dollars in keys", () => {
      const result = sanitizeObject({ "key.with.dots": 1, $dollar: 2 });
      expect(result).toHaveProperty("key_with_dots", 1);
      expect(result).toHaveProperty("_dollar", 2);
    });

    it("handles nested objects", () => {
      const result = sanitizeObject({ outer: { "inner.key": "v" } });
      expect(result.outer).toHaveProperty("inner_key", "v");
    });

    it("handles arrays", () => {
      const result = sanitizeObject([{ "a.b": 1 }]);
      expect(result[0]).toHaveProperty("a_b", 1);
    });

    it("returns non-objects as-is", () => {
      expect(sanitizeObject(null)).toBeNull();
      expect(sanitizeObject(42)).toBe(42);
      expect(sanitizeObject("str")).toBe("str");
    });
  });
});
