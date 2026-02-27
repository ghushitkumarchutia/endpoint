const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
  },
  stream: { write: jest.fn() },
}));

const User = require("../../models/User");

let app;
let server;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret-key";
  process.env.MONGO_URI =
    process.env.MONGO_URI_TEST || "mongodb://localhost:27017/endpoint-test";

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch {
    console.warn("MongoDB not available, skipping integration tests");
    return;
  }

  app = require("../../app");
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await User.deleteMany({ email: /^inttest_/ });
    await mongoose.connection.close();
  }
  if (server) server.close();
});

const testEmail = `inttest_${Date.now()}@example.com`;
const testPassword = "TestPass_12345";
let authToken;

describe("Auth Routes", () => {
  describe("POST /api/auth/register", () => {
    it("registers a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test User", email: testEmail, password: testPassword });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testEmail.toLowerCase());
      authToken = res.body.token;
    });

    it("rejects duplicate email", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Dupe", email: testEmail, password: testPassword });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("rejects missing fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: testEmail });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("logs in with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testEmail, password: testPassword });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      authToken = res.body.token;
    });

    it("rejects wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testEmail, password: "WrongPassword_123" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/auth/me", () => {
    it("returns user profile with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testEmail.toLowerCase());
    });

    it("rejects request without token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("rejects invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid.token.here");

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/auth/profile", () => {
    it("updates user name", async () => {
      const res = await request(app)
        .put("/api/auth/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Updated Name" });

      expect(res.status).toBe(200);
      expect(res.body.user.name).toBe("Updated Name");
    });
  });

  describe("PUT /api/auth/change-password", () => {
    it("changes password with correct current password", async () => {
      const newPassword = "NewTestPass_67890";
      const res = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ currentPassword: testPassword, newPassword });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("rejects wrong current password", async () => {
      const res = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          currentPassword: "WrongOldPass_123",
          newPassword: "DoesntMatter_1",
        });

      expect(res.status).toBe(401);
    });
  });
});
