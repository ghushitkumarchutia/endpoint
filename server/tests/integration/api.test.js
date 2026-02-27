const request = require("supertest");
const mongoose = require("mongoose");

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
const Api = require("../../models/Api");

let app;
let authToken;
let apiId;
const testEmail = `apitest_${Date.now()}@example.com`;
const testPassword = "ApiTestPass_12345";

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

  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({ name: "API Test User", email: testEmail, password: testPassword });
  authToken = registerRes.body.token;
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await Api.deleteMany({ name: /^IntTest/ });
    await User.deleteMany({ email: /^apitest_/ });
    await mongoose.connection.close();
  }
});

describe("API Routes", () => {
  describe("POST /api/apis", () => {
    it("creates a new API", async () => {
      const res = await request(app)
        .post("/api/apis")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "IntTest JSONPlaceholder",
          url: "https://jsonplaceholder.typicode.com/todos/1",
          method: "GET",
          checkFrequency: 60000,
          timeout: 10000,
          expectedStatusCode: 200,
          category: "Testing",
        });

      expect(res.status).toBe(201);
      expect(res.body.data._id).toBeDefined();
      apiId = res.body.data._id;
    });

    it("rejects invalid URL", async () => {
      const res = await request(app)
        .post("/api/apis")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Invalid API",
          url: "not-a-url",
          method: "GET",
        });

      expect(res.status).toBe(400);
    });

    it("rejects request without auth", async () => {
      const res = await request(app).post("/api/apis").send({
        name: "No Auth API",
        url: "https://example.com",
        method: "GET",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/apis", () => {
    it("lists user APIs", async () => {
      const res = await request(app)
        .get("/api/apis")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /api/apis/:id", () => {
    it("returns specific API", async () => {
      const res = await request(app)
        .get(`/api/apis/${apiId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(apiId);
    });

    it("returns 404 for non-existent API", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/apis/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/apis/:id", () => {
    it("updates API description", async () => {
      const res = await request(app)
        .put(`/api/apis/${apiId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ description: "Updated via integration test" });

      expect(res.status).toBe(200);
      expect(res.body.data.description).toBe("Updated via integration test");
    });
  });

  describe("PATCH /api/apis/:id/toggle", () => {
    it("toggles API active status", async () => {
      const res = await request(app)
        .patch(`/api/apis/${apiId}/toggle`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/apis/dashboard-stats", () => {
    it("returns dashboard statistics", async () => {
      const res = await request(app)
        .get("/api/apis/dashboard-stats")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("totalApis");
    });
  });

  describe("GET /api/apis/categories", () => {
    it("returns categories list", async () => {
      const res = await request(app)
        .get("/api/apis/categories")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("DELETE /api/apis/:id", () => {
    it("deletes the API", async () => {
      const res = await request(app)
        .delete(`/api/apis/${apiId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
