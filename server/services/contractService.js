const Ajv = require("ajv");
const ContractViolation = require("../models/ContractViolation");
const { analyzeContractViolation } = require("./aiService");

const ajv = new Ajv({ allErrors: true, strict: false, cache: true });

const schemaCache = new Map();
const MAX_SCHEMA_CACHE_SIZE = 100;

const getCompiledSchema = (schema) => {
  const schemaKey = JSON.stringify(schema);

  if (schemaCache.has(schemaKey)) {
    return schemaCache.get(schemaKey);
  }

  if (schemaCache.size >= MAX_SCHEMA_CACHE_SIZE) {
    const firstKey = schemaCache.keys().next().value;
    schemaCache.delete(firstKey);
  }

  const compiled = ajv.compile(schema);
  schemaCache.set(schemaKey, compiled);
  return compiled;
};

const validateContract = async (api, check) => {
  if (!api.responseContract || !api.responseContract.enabled) return null;
  const violations = [];
  if (
    api.responseContract.expectedResponseTime &&
    check.responseTime > api.responseContract.expectedResponseTime
  ) {
    violations.push({
      type: "RESPONSE_TIME_BREACH",
      field: "responseTime",
      expected: `<=${api.responseContract.expectedResponseTime}ms`,
      actual: `${check.responseTime}ms`,
      severity:
        check.responseTime > api.responseContract.expectedResponseTime * 2
          ? "high"
          : "medium",
    });
  }
  if (api.expectedStatusCode && check.statusCode !== api.expectedStatusCode) {
    violations.push({
      type: "STATUS_MISMATCH",
      field: "statusCode",
      expected: api.expectedStatusCode.toString(),
      actual: check.statusCode?.toString() || "null",
      severity: "high",
    });
  }
  if (api.responseContract.schema && check.responseBody && check.success) {
    const schemaViolations = validateSchema(
      api.responseContract.schema,
      check.responseBody,
      api.responseContract.strictMode,
    );
    violations.push(...schemaViolations);
  }
  if (violations.length === 0) return null;
  let aiExplanation = null;
  if (violations.length > 0) {
    aiExplanation = await analyzeContractViolation(api.name, violations);
  }
  const contractViolation = await ContractViolation.create({
    apiId: api._id,
    checkId: check._id,
    violations,
    aiExplanation,
  });

  // Create notification for the violation
  const Notification = require("../models/Notification");
  await Notification.create({
    userId: api.userId,
    type: "CONTRACT_VIOLATION",
    message: `Contract violation detected on API "${api.name}"`,
    metadata: {
      apiId: api._id,
      violationId: contractViolation._id,
      violationCount: violations.length,
      severity: violations.some(
        (v) => v.severity === "critical" || v.severity === "high",
      )
        ? "high"
        : "medium",
    },
  });

  return contractViolation;
};

const validateSchema = (schema, response, strictMode = false) => {
  const violations = [];
  try {
    const validate = getCompiledSchema(schema);
    const valid = validate(response);
    if (!valid && validate.errors) {
      for (const error of validate.errors) {
        let type = "TYPE_MISMATCH";
        if (error.keyword === "required") type = "MISSING_FIELD";
        if (error.keyword === "additionalProperties" && strictMode)
          type = "EXTRA_FIELD";
        violations.push({
          type,
          field: error.instancePath || error.params?.missingProperty || "root",
          expected: error.message,
          actual: JSON.stringify(error.data || "undefined").substring(0, 100),
          severity: type === "MISSING_FIELD" ? "high" : "medium",
        });
      }
    }
  } catch (error) {
    console.error("Schema validation error:", error.message);
    violations.push({
      type: "SCHEMA_ERROR",
      field: "schema",
      expected: "Valid JSON Schema",
      actual: error.message.substring(0, 100),
      severity: "low",
    });
  }
  return violations;
};

const getViolationHistory = async (apiId, options = {}) => {
  const { limit = 50, startDate, endDate, acknowledged } = options;
  const query = { apiId };
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  if (typeof acknowledged === "boolean") {
    query.acknowledged = acknowledged;
  }
  return ContractViolation.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

const getViolationStats = async (apiId, days = 7) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const stats = await ContractViolation.aggregate([
    { $match: { apiId, createdAt: { $gte: since } } },
    { $unwind: "$violations" },
    {
      $group: {
        _id: "$violations.type",
        count: { $sum: 1 },
        avgSeverity: {
          $avg: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$violations.severity", "critical"] },
                  then: 4,
                },
                { case: { $eq: ["$violations.severity", "high"] }, then: 3 },
                { case: { $eq: ["$violations.severity", "medium"] }, then: 2 },
              ],
              default: 1,
            },
          },
        },
      },
    },
    { $sort: { count: -1 } },
  ]);
  const total = await ContractViolation.countDocuments({
    apiId,
    createdAt: { $gte: since },
  });
  return { byType: stats, total, period: `${days} days` };
};

const acknowledgeViolation = async (violationId) => {
  return ContractViolation.findByIdAndUpdate(
    violationId,
    { acknowledged: true, acknowledgedAt: new Date() },
    { new: true },
  );
};

module.exports = {
  validateContract,
  getViolationHistory,
  getViolationStats,
  acknowledgeViolation,
};
