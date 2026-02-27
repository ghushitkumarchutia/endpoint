const { logger } = require("../../utils/logger");

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
  },
}));

const errorHandler = require("../../middleware/errorHandler");

const mockReq = (overrides = {}) => ({
  path: "/api/test",
  method: "GET",
  ip: "127.0.0.1",
  ...overrides,
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("errorHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles CastError as 400", () => {
    const err = new Error("Cast failed");
    err.name = "CastError";
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid ID format",
    });
  });

  it("handles duplicate key error (11000) as 400", () => {
    const err = new Error("Duplicate");
    err.code = 11000;
    err.keyValue = { email: "test@test.com" };
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining("email"),
      }),
    );
  });

  it("handles ValidationError as 400", () => {
    const err = new Error("Validation failed");
    err.name = "ValidationError";
    err.errors = {
      name: { message: "Name is required" },
      email: { message: "Email is invalid" },
    };
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("handles JsonWebTokenError as 401", () => {
    const err = new Error("jwt malformed");
    err.name = "JsonWebTokenError";
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token",
    });
  });

  it("handles TokenExpiredError as 401", () => {
    const err = new Error("jwt expired");
    err.name = "TokenExpiredError";
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Token expired",
    });
  });

  it("handles MongoNetworkError as 503", () => {
    const err = new Error("connection refused");
    err.name = "MongoNetworkError";
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(503);
  });

  it("handles rate limit (429)", () => {
    const err = new Error("Too many requests");
    err.status = 429;
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(429);
  });

  it("handles entity too large (413)", () => {
    const err = new Error("Payload too large");
    err.type = "entity.too.large";
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(413);
  });

  it("handles malformed JSON as 400", () => {
    const err = new SyntaxError("Unexpected token");
    err.status = 400;
    err.body = "invalid json";
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid JSON in request body",
    });
  });

  it("handles Axios errors as 502", () => {
    const err = new Error("ECONNREFUSED");
    err.isAxiosError = true;
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(502);
  });

  it("defaults to 500 for unknown errors", () => {
    const err = new Error("Something broke");
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("includes stack trace in non-production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const err = new Error("Debug error");
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    const response = res.json.mock.calls[0][0];
    expect(response).toHaveProperty("stack");
    process.env.NODE_ENV = originalEnv;
  });

  it("hides stack trace in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const err = new Error("Server error");
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext);
    const response = res.json.mock.calls[0][0];
    expect(response).not.toHaveProperty("stack");
    process.env.NODE_ENV = originalEnv;
  });
});
