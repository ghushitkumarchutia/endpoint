process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key-for-jest";
process.env.MONGO_URI = "mongodb://localhost:27017/endpoint-test";
process.env.PORT = "0";

jest.mock("../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
  },
  stream: {
    write: jest.fn(),
  },
}));
