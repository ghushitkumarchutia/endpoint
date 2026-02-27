const {
  CACHE_KEYS,
  CACHE_TTL,
  getOrSet,
  invalidate,
  invalidateUserCache,
  flushAll,
  getStats,
  cache,
} = require("../../utils/cache");

describe("cache", () => {
  beforeEach(() => {
    flushAll();
  });

  describe("CACHE_KEYS", () => {
    it("generates user-specific keys", () => {
      const userId = "user123";
      expect(CACHE_KEYS.DASHBOARD_STATS(userId)).toBe(
        "dashboard_stats_user123",
      );
      expect(CACHE_KEYS.API_LIST(userId)).toBe("api_list_user123");
      expect(CACHE_KEYS.CATEGORIES(userId)).toBe("categories_user123");
      expect(CACHE_KEYS.SLA_SUMMARY(userId)).toBe("sla_summary_user123");
      expect(CACHE_KEYS.COST_ANALYTICS(userId)).toBe("cost_analytics_user123");
      expect(CACHE_KEYS.DEPENDENCY_GRAPH(userId)).toBe(
        "dependency_graph_user123",
      );
      expect(CACHE_KEYS.NOTIFICATIONS_COUNT(userId)).toBe(
        "notifications_count_user123",
      );
    });
  });

  describe("CACHE_TTL", () => {
    it("has correct TTL values", () => {
      expect(CACHE_TTL.SHORT).toBe(30);
      expect(CACHE_TTL.MEDIUM).toBe(60);
      expect(CACHE_TTL.LONG).toBe(300);
      expect(CACHE_TTL.VERY_LONG).toBe(900);
    });
  });

  describe("getOrSet", () => {
    it("fetches and caches data on first call", async () => {
      const fetchFn = jest.fn().mockResolvedValue({ data: "test" });
      const result = await getOrSet("testKey", fetchFn, CACHE_TTL.MEDIUM);
      expect(result).toEqual({ data: "test" });
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it("returns cached data on subsequent calls", async () => {
      const fetchFn = jest.fn().mockResolvedValue({ data: "test" });
      await getOrSet("testKey", fetchFn);
      const result = await getOrSet("testKey", fetchFn);
      expect(result).toEqual({ data: "test" });
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it("uses default TTL when not specified", async () => {
      const fetchFn = jest.fn().mockResolvedValue("data");
      await getOrSet("key", fetchFn);
      const ttl = cache.getTtl("key");
      expect(ttl).toBeDefined();
    });
  });

  describe("invalidate", () => {
    it("removes a single key", async () => {
      cache.set("key1", "value1");
      invalidate("key1");
      expect(cache.get("key1")).toBeUndefined();
    });

    it("removes an array of keys", async () => {
      cache.set("key1", "value1");
      cache.set("key2", "value2");
      invalidate(["key1", "key2"]);
      expect(cache.get("key1")).toBeUndefined();
      expect(cache.get("key2")).toBeUndefined();
    });
  });

  describe("invalidateUserCache", () => {
    it("removes all keys matching userId", () => {
      cache.set("dashboard_stats_user1", "d1");
      cache.set("api_list_user1", "a1");
      cache.set("dashboard_stats_user2", "d2");
      invalidateUserCache("user1");
      expect(cache.get("dashboard_stats_user1")).toBeUndefined();
      expect(cache.get("api_list_user1")).toBeUndefined();
      expect(cache.get("dashboard_stats_user2")).toBe("d2");
    });
  });

  describe("flushAll", () => {
    it("clears all cached data", () => {
      cache.set("k1", "v1");
      cache.set("k2", "v2");
      flushAll();
      expect(cache.keys()).toHaveLength(0);
    });
  });

  describe("getStats", () => {
    it("returns cache statistics", () => {
      const stats = getStats();
      expect(stats).toHaveProperty("hits");
      expect(stats).toHaveProperty("misses");
      expect(stats).toHaveProperty("keys");
    });
  });
});
