const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

// Rate limiting for AI API calls
const AI_CONFIG = {
  MAX_REQUESTS_PER_MINUTE: 30,
  REQUEST_TIMEOUT: 15000, // 15 seconds
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000,
};

// Simple in-memory rate limiter for AI calls
const rateLimiter = {
  requests: [],
  isAllowed: function () {
    const now = Date.now();
    // Remove requests older than 1 minute
    this.requests = this.requests.filter((time) => now - time < 60000);
    if (this.requests.length >= AI_CONFIG.MAX_REQUESTS_PER_MINUTE) {
      return false;
    }
    this.requests.push(now);
    return true;
  },
};

// Queue for AI requests
const requestQueue = {
  queue: [],
  isProcessing: false,
  add: function (fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  },
  process: async function () {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      if (!rateLimiter.isAllowed()) {
        // Wait before trying again
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      const { fn, resolve, reject } = this.queue.shift();
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.isProcessing = false;
  },
};

const initializeAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 500, // Limit response size
        temperature: 0.7,
      },
    });
  }
};

const generateContent = async (prompt, retryCount = 0) => {
  initializeAI();
  if (!model) return null;

  try {
    // Use queue to manage concurrent requests
    const result = await requestQueue.add(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        AI_CONFIG.REQUEST_TIMEOUT,
      );

      try {
        const response = await model.generateContent(prompt);
        clearTimeout(timeoutId);
        return response.response.text();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    });

    return result;
  } catch (error) {
    // Retry on transient errors
    if (retryCount < AI_CONFIG.MAX_RETRIES) {
      if (
        error.message?.includes("429") ||
        error.message?.includes("quota") ||
        error.message?.includes("rate")
      ) {
        // Rate limited - wait longer
        await new Promise((r) =>
          setTimeout(r, AI_CONFIG.RETRY_DELAY * (retryCount + 2)),
        );
        return generateContent(prompt, retryCount + 1);
      }
      if (error.name === "AbortError" || error.message?.includes("timeout")) {
        await new Promise((r) =>
          setTimeout(r, AI_CONFIG.RETRY_DELAY * (retryCount + 1)),
        );
        return generateContent(prompt, retryCount + 1);
      }
    }
    console.error("AI Service Error:", error.message);
    return null;
  }
};

const generateAnomalyInsight = async (
  apiName,
  anomalyType,
  currentValue,
  expectedValue,
) => {
  const prompt = `You are an API monitoring expert. Analyze this anomaly briefly:

API: "${apiName}"
Issue: ${anomalyType.replace(/_/g, " ")}
Current Value: ${currentValue}ms
Expected Value: ${expectedValue}ms

Provide 2-3 possible causes in simple terms (2-3 sentences total). Be concise.`;

  const response = await generateContent(prompt);
  return response || "Unable to generate AI insight at this time.";
};

const analyzeContractViolation = async (apiName, violations) => {
  const violationsSummary = violations
    .map(
      (v) =>
        `- ${v.type}: expected ${v.expected}, got ${v.actual} for field "${v.field}"`,
    )
    .join("\n");

  const prompt = `You are an API contract testing expert. Analyze these contract violations:

API: "${apiName}"
Violations:
${violationsSummary}

Provide a brief explanation (2-3 sentences) of:
1. Why these violations matter
2. Suggested fix`;

  const response = await generateContent(prompt);
  return response || "Unable to analyze contract violations.";
};

const analyzeRootCause = async (apiName, context, correlatedFailures) => {
  const correlations = correlatedFailures
    .map(
      (f) =>
        `- ${f.apiName}: failed ${f.timeDelta}ms ${f.timeDelta > 0 ? "after" : "before"}`,
    )
    .join("\n");

  const prompt = `You are an API reliability expert. Perform root cause analysis:

Failed API: "${apiName}"
Error: ${context.error || "Unknown"}
Status Code: ${context.statusCode || "N/A"}
Response Time: ${context.responseTime}ms

${correlations ? `Correlated Failures:\n${correlations}` : "No correlated failures detected."}

Provide:
1. Most likely root cause (1 sentence)
2. Two other possible causes
3. Recommended action`;

  const response = await generateContent(prompt);
  return response || "Unable to perform root cause analysis.";
};

const generatePredictiveAnalysis = async (apiName, signals, recentMetrics) => {
  const signalsSummary = signals
    .map((s) => `- ${s.signal}: ${s.severity} severity`)
    .join("\n");

  const prompt = `You are an API reliability expert. Analyze these early warning signals:

API: "${apiName}"
Warning Signals:
${signalsSummary}

Recent Metrics:
- Avg Response Time: ${recentMetrics.avgResponseTime}ms
- Error Rate: ${recentMetrics.errorRate}%
- Trend: ${recentMetrics.trend}

Predict:
1. Likelihood of failure (low/medium/high)
2. Expected timeframe if issues continue
3. Two recommended preventive actions`;

  const response = await generateContent(prompt);
  return response || "Unable to generate predictive analysis.";
};

const parseNaturalLanguageQuery = async (query, availableApis) => {
  const apiNames = availableApis.map((a) => a.name).join(", ");

  const prompt = `You are an API analytics assistant. Parse this natural language query:

Query: "${query}"
Available APIs: ${apiNames}

Return a JSON object with:
{
  "type": "status_check|performance_query|error_analysis|comparison|trend_analysis|list_apis|cost_query|sla_query|unknown",
  "entities": {
    "apiNames": ["api names mentioned or empty array"],
    "timeRange": {"relative": "last hour|today|this week|this month|null"},
    "metrics": ["response_time|uptime|error_rate|cost|etc"]
  },
  "confidence": 0-100
}

Return ONLY the JSON, no explanation.`;

  const response = await generateContent(prompt);
  if (!response) {
    return { type: "unknown", entities: {}, confidence: 0 };
  }
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    return jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { type: "unknown", entities: {}, confidence: 0 };
  } catch {
    return { type: "unknown", entities: {}, confidence: 0 };
  }
};

const diagnosePerformanceRegression = async (
  apiName,
  baselineStats,
  currentStats,
  degradationPercent,
) => {
  const prompt = `You are an API performance expert. Diagnose this performance regression:

API: "${apiName}"
Baseline Performance:
- Mean: ${baselineStats.mean}ms
- P95: ${baselineStats.p95}ms

Current Performance:
- Mean: ${currentStats.mean}ms
- P95: ${currentStats.p95}ms

Degradation: ${degradationPercent}%

Provide:
1. Most likely cause of degradation
2. Impact assessment
3. Recommended remediation steps`;

  const response = await generateContent(prompt);
  return response || "Unable to diagnose performance regression.";
};

module.exports = {
  generateAnomalyInsight,
  analyzeContractViolation,
  analyzeRootCause,
  generatePredictiveAnalysis,
  parseNaturalLanguageQuery,
  diagnosePerformanceRegression,
};
