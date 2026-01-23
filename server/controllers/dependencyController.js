const {
  getDependencyGraph,
  addDependency,
  removeDependency,
  getApiDependency,
  getImpactAnalysis,
  detectDependenciesFromFailures,
} = require("../services/dependencyService");
const Api = require("../models/Api");
const { getOrSet, invalidate, CACHE_TTL } = require("../utils/cache");

const getGraph = async (req, res, next) => {
  try {
    // Cache dependency graph for 5 minutes
    const cacheKey = `dep_graph_${req.user._id}`;
    const graph = await getOrSet(
      cacheKey,
      async () => getDependencyGraph(req.user._id),
      CACHE_TTL.MEDIUM,
    );

    res.json({
      success: true,
      data: graph,
    });
  } catch (error) {
    next(error);
  }
};

const getApiDependencies = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const api = await Api.findOne({ _id: apiId, userId: req.user._id });
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    const dependency = await getApiDependency(apiId);
    res.json({
      success: true,
      data: {
        apiId,
        apiName: api.name,
        dependencies: dependency || {
          dependsOn: [],
          dependents: [],
          criticalPath: null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const addApiDependency = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const { dependsOnApiId, relationship, isRequired } = req.body;
    if (!dependsOnApiId) {
      return res.status(400).json({
        success: false,
        message: "dependsOnApiId is required",
      });
    }
    const dependency = await addDependency(
      apiId,
      req.user._id,
      dependsOnApiId,
      relationship || "calls",
      isRequired !== false,
    );

    // Invalidate dependency graph cache
    invalidate(`dep_graph_${req.user._id}`);

    res.json({
      success: true,
      message: "Dependency added successfully",
      data: dependency,
    });
  } catch (error) {
    if (error.message === "API not found or access denied") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === "API cannot depend on itself") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const removeApiDependency = async (req, res, next) => {
  try {
    const { apiId, dependsOnApiId } = req.params;
    const api = await Api.findOne({ _id: apiId, userId: req.user._id });
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    await removeDependency(apiId, dependsOnApiId);

    // Invalidate dependency graph cache
    invalidate(`dep_graph_${req.user._id}`);

    res.json({
      success: true,
      message: "Dependency removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getImpact = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const api = await Api.findOne({ _id: apiId, userId: req.user._id });
    if (!api) {
      return res.status(404).json({ success: false, message: "API not found" });
    }
    const impact = await getImpactAnalysis(apiId, req.user._id);
    res.json({
      success: true,
      data: {
        apiId,
        apiName: api.name,
        impact,
      },
    });
  } catch (error) {
    next(error);
  }
};

const detectDependencies = async (req, res, next) => {
  try {
    const detected = await detectDependenciesFromFailures(req.user._id);
    const apis = await Api.find({ userId: req.user._id })
      .select("_id name")
      .lean();
    const apiMap = new Map(apis.map((a) => [a._id.toString(), a.name]));
    const suggestions = detected.map((d) => ({
      apiId: d.apiId,
      apiName: apiMap.get(d.apiId.toString()) || "Unknown",
      dependsOnApiId: d.dependsOn,
      dependsOnApiName: apiMap.get(d.dependsOn.toString()) || "Unknown",
      confidence: Math.min(d.occurrences * 20, 100),
      occurrences: d.occurrences,
    }));
    res.json({
      success: true,
      message: `Found ${suggestions.length} potential dependencies`,
      data: { suggestions },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGraph,
  getApiDependencies,
  addApiDependency,
  removeApiDependency,
  getImpact,
  detectDependencies,
};
