const APIDependency = require("../models/APIDependency");
const Api = require("../models/Api");
const Check = require("../models/Check");

const getDependencyGraph = async (userId) => {
  const apis = await Api.find({ userId }).select("_id name url").lean();
  const dependencies = await APIDependency.find({ userId }).lean();
  const depMap = new Map(dependencies.map((d) => [d.apiId.toString(), d]));
  const nodes = apis.map((api) => {
    const dep = depMap.get(api._id.toString());
    return {
      id: api._id,
      name: api.name,
      url: api.url,
      dependsOnCount: dep?.dependsOn?.length || 0,
      dependentsCount: dep?.dependents?.length || 0,
      isCritical: dep?.criticalPath?.isCritical || false,
      impactScore: dep?.criticalPath?.impactScore || 0,
    };
  });
  const edges = [];
  for (const dep of dependencies) {
    for (const target of dep.dependsOn || []) {
      edges.push({
        source: dep.apiId,
        target: target.apiId,
        relationship: target.relationship,
        isRequired: target.isRequired,
      });
    }
  }
  return { nodes, edges };
};

const addDependency = async (
  apiId,
  userId,
  dependsOnApiId,
  relationship = "calls",
  isRequired = true,
) => {
  const [api, dependsOnApi] = await Promise.all([
    Api.findOne({ _id: apiId, userId }),
    Api.findOne({ _id: dependsOnApiId, userId }),
  ]);
  if (!api || !dependsOnApi) {
    throw new Error("API not found or access denied");
  }
  if (apiId.toString() === dependsOnApiId.toString()) {
    throw new Error("API cannot depend on itself");
  }
  let dependency = await APIDependency.findOne({ apiId });
  if (!dependency) {
    dependency = new APIDependency({
      apiId,
      userId,
      dependsOn: [],
      dependents: [],
    });
  }
  const existingDep = dependency.dependsOn.find(
    (d) => d.apiId.toString() === dependsOnApiId.toString(),
  );
  if (!existingDep) {
    dependency.dependsOn.push({
      apiId: dependsOnApiId,
      apiName: dependsOnApi.name,
      relationship,
      isRequired,
    });
  }
  dependency.lastUpdated = new Date();
  await dependency.save();
  let targetDependency = await APIDependency.findOne({ apiId: dependsOnApiId });
  if (!targetDependency) {
    targetDependency = new APIDependency({
      apiId: dependsOnApiId,
      userId,
      dependsOn: [],
      dependents: [],
    });
  }
  const existingDependent = targetDependency.dependents.find(
    (d) => d.apiId.toString() === apiId.toString(),
  );
  if (!existingDependent) {
    targetDependency.dependents.push({
      apiId,
      apiName: api.name,
      relationship,
    });
  }
  targetDependency.lastUpdated = new Date();
  await targetDependency.save();
  await recalculateCriticalPaths(userId);
  return dependency;
};

const removeDependency = async (apiId, dependsOnApiId) => {
  await APIDependency.updateOne(
    { apiId },
    {
      $pull: { dependsOn: { apiId: dependsOnApiId } },
      lastUpdated: new Date(),
    },
  );
  await APIDependency.updateOne(
    { apiId: dependsOnApiId },
    { $pull: { dependents: { apiId } }, lastUpdated: new Date() },
  );
};

const recalculateCriticalPaths = async (userId) => {
  try {
    const dependencies = await APIDependency.find({ userId }).lean();
    const depMap = new Map(dependencies.map((d) => [d.apiId.toString(), d]));

    // Batch update instead of individual saves
    const bulkOps = [];

    for (const dep of dependencies) {
      const affectedServices = countAffectedServices(
        dep.apiId.toString(),
        depMap,
        new Set(),
      );
      const isCritical = affectedServices >= 2 || dep.dependents.length >= 3;
      const impactScore = Math.min(
        affectedServices * 20 + dep.dependents.length * 10,
        100,
      );

      bulkOps.push({
        updateOne: {
          filter: { _id: dep._id },
          update: {
            $set: {
              criticalPath: {
                isCritical,
                impactScore,
                affectedServices,
              },
            },
          },
        },
      });
    }

    if (bulkOps.length > 0) {
      await APIDependency.bulkWrite(bulkOps, { ordered: false });
    }
  } catch (error) {
    console.error("Failed to recalculate critical paths:", error.message);
    // Don't throw - this is a non-critical operation
  }
};

const countAffectedServices = (apiId, depMap, visited) => {
  if (visited.has(apiId)) return 0;
  visited.add(apiId);
  const dep = depMap.get(apiId);
  if (!dep) return 0;
  let count = dep.dependents.length;
  for (const dependent of dep.dependents) {
    count += countAffectedServices(dependent.apiId.toString(), depMap, visited);
  }
  return count;
};

const getApiDependency = async (apiId) => {
  return APIDependency.findOne({ apiId }).lean();
};

const getImpactAnalysis = async (apiId, userId) => {
  const dependency = await APIDependency.findOne({ apiId });
  if (!dependency) {
    return { directImpact: [], cascadeImpact: [], totalAffected: 0 };
  }
  const allDependencies = await APIDependency.find({ userId });
  const depMap = new Map(allDependencies.map((d) => [d.apiId.toString(), d]));
  const directImpact = dependency.dependents.map((d) => ({
    apiId: d.apiId,
    apiName: d.apiName,
    relationship: d.relationship,
    level: 1,
  }));
  const cascadeImpact = [];
  const visited = new Set([apiId.toString()]);
  const queue = [...directImpact];
  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current.apiId.toString())) continue;
    visited.add(current.apiId.toString());
    const currentDep = depMap.get(current.apiId.toString());
    if (currentDep) {
      for (const dependent of currentDep.dependents) {
        if (!visited.has(dependent.apiId.toString())) {
          const impact = {
            apiId: dependent.apiId,
            apiName: dependent.apiName,
            relationship: dependent.relationship,
            level: current.level + 1,
          };
          cascadeImpact.push(impact);
          queue.push(impact);
        }
      }
    }
  }
  return {
    directImpact,
    cascadeImpact,
    totalAffected: directImpact.length + cascadeImpact.length,
  };
};

const detectDependenciesFromFailures = async (userId) => {
  const apis = await Api.find({ userId }).select("_id name").lean();
  const window = 5 * 60 * 1000;
  const detectedDependencies = [];
  for (const api of apis) {
    const failures = await Check.find({
      apiId: api._id,
      success: false,
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    })
      .select("timestamp")
      .lean();
    for (const failure of failures) {
      const correlatedFailures = await Check.find({
        apiId: { $ne: api._id, $in: apis.map((a) => a._id) },
        success: false,
        timestamp: {
          $gte: new Date(failure.timestamp.getTime() - window),
          $lte: new Date(failure.timestamp.getTime() + window),
        },
      })
        .select("apiId timestamp")
        .lean();
      for (const correlated of correlatedFailures) {
        if (correlated.timestamp < failure.timestamp) {
          detectedDependencies.push({
            apiId: api._id,
            dependsOn: correlated.apiId,
            timeDelta: failure.timestamp - correlated.timestamp,
          });
        }
      }
    }
  }
  const grouped = new Map();
  for (const dep of detectedDependencies) {
    const key = `${dep.apiId}-${dep.dependsOn}`;
    if (!grouped.has(key)) {
      grouped.set(key, { ...dep, occurrences: 0 });
    }
    grouped.get(key).occurrences++;
  }
  return Array.from(grouped.values())
    .filter((d) => d.occurrences >= 2)
    .sort((a, b) => b.occurrences - a.occurrences);
};

module.exports = {
  getDependencyGraph,
  addDependency,
  removeDependency,
  getApiDependency,
  getImpactAnalysis,
  detectDependenciesFromFailures,
};
