module.exports = {
  testEnvironment: "node",
  testTimeout: 30000,
  testMatch: ["**/tests/**/*.test.js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "utils/**/*.js",
    "middleware/**/*.js",
    "controllers/**/*.js",
    "services/**/*.js",
    "!**/node_modules/**",
  ],
  coverageThresholds: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  setupFilesAfterSetup: ["./tests/setup.js"],
};
