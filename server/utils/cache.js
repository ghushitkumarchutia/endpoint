const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120,
  useClones: false,
  maxKeys: 1000,
});

const CACHE_KEYS = {
  DASHBOARD_STATS: (userId) => `dashboard_stats_${userId}`,
  API_LIST: (userId) => `api_list_${userId}`,
  CATEGORIES: (userId) => `categories_${userId}`,
  SLA_SUMMARY: (userId) => `sla_summary_${userId}`,
  COST_ANALYTICS: (userId) => `cost_analytics_${userId}`,
  DEPENDENCY_GRAPH: (userId) => `dependency_graph_${userId}`,
  NOTIFICATIONS_COUNT: (userId) => `notifications_count_${userId}`,
};

const CACHE_TTL = {
  SHORT: 30,
  MEDIUM: 60,
  LONG: 300,
  VERY_LONG: 900,
};

const getOrSet = async (key, fetchFn, ttl = CACHE_TTL.MEDIUM) => {
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const data = await fetchFn();
  cache.set(key, data, ttl);
  return data;
};

const invalidate = (keys) => {
  if (Array.isArray(keys)) {
    keys.forEach((key) => cache.del(key));
  } else {
    cache.del(keys);
  }
};

const invalidateUserCache = (userId) => {
  const keys = cache.keys().filter((key) => key.includes(userId));
  keys.forEach((key) => cache.del(key));
};

const flushAll = () => {
  cache.flushAll();
};

const getStats = () => {
  return cache.getStats();
};

module.exports = {
  cache,
  CACHE_KEYS,
  CACHE_TTL,
  getOrSet,
  invalidate,
  invalidateUserCache,
  flushAll,
  getStats,
};
