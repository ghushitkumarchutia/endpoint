const {
  processQuery,
  markQueryHelpful,
  getQueryHistory,
} = require("../services/nlQueryService");

const query = async (req, res, next) => {
  try {
    const { query: userQuery } = req.body;
    if (!userQuery || userQuery.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }
    if (userQuery.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Query must be under 500 characters",
      });
    }
    const result = await processQuery(req.user._id, userQuery);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const feedback = async (req, res, next) => {
  try {
    const { queryId } = req.params;
    const { wasHelpful } = req.body;
    if (typeof wasHelpful !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "wasHelpful must be a boolean",
      });
    }
    const updated = await markQueryHelpful(queryId, wasHelpful);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }
    res.json({
      success: true,
      message: "Feedback recorded",
    });
  } catch (error) {
    next(error);
  }
};

const history = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const queries = await getQueryHistory(req.user._id, parseInt(limit) || 20);
    res.json({
      success: true,
      data: queries,
    });
  } catch (error) {
    next(error);
  }
};

const suggestions = async (req, res, next) => {
  try {
    const exampleQueries = [
      "What's the status of all my APIs?",
      "Show me the performance of Payment API this week",
      "Which APIs had the most errors today?",
      "Compare response times between Auth API and User API",
      "What are my total costs this month?",
      "Is my Authentication Service meeting SLA targets?",
      "Show me the trend for Main API over the last week",
      "List all my APIs",
    ];
    res.json({
      success: true,
      data: { suggestions: exampleQueries },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  query,
  feedback,
  history,
  suggestions,
};
