const {
  createEndpoint,
  receivePayload,
  getEndpoints,
  getEndpointWithPayloads,
  deleteEndpoint,
  clearPayloads,
  toggleEndpoint,
  getPayloadById,
} = require("../services/webhookService");

const create = async (req, res, next) => {
  try {
    const { name, description, maxPayloads, expiresInDays } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Endpoint name is required",
      });
    }
    const endpoint = await createEndpoint(req.user._id, name, description, {
      maxPayloads,
      expiresInDays,
    });
    res.status(201).json({
      success: true,
      message: "Webhook endpoint created",
      data: endpoint,
    });
  } catch (error) {
    next(error);
  }
};

const receive = async (req, res, next) => {
  try {
    const { uniqueId } = req.params;
    // Convert req.query (which has null prototype) to a plain object for Mongoose Map
    const queryParams = {};
    for (const [key, value] of Object.entries(req.query)) {
      queryParams[key] = String(value);
    }
    // Convert headers similarly, filtering sensitive ones
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (!["authorization", "cookie"].includes(key.toLowerCase())) {
        headers[key] = String(value);
      }
    }
    const payload = {
      receivedAt: new Date(),
      method: req.method,
      headers,
      body: req.body,
      queryParams,
      sourceIp: req.ip || req.connection?.remoteAddress,
    };
    const result = await receivePayload(uniqueId, payload);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const endpoints = await getEndpoints(req.user._id);
    res.json({
      success: true,
      data: endpoints,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { uniqueId } = req.params;
    const endpoint = await getEndpointWithPayloads(uniqueId, req.user._id);
    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: "Endpoint not found",
      });
    }
    res.json({
      success: true,
      data: endpoint,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { uniqueId } = req.params;
    const deleted = await deleteEndpoint(uniqueId, req.user._id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Endpoint not found",
      });
    }
    res.json({
      success: true,
      message: "Endpoint deleted",
    });
  } catch (error) {
    next(error);
  }
};

const clear = async (req, res, next) => {
  try {
    const { uniqueId } = req.params;
    const cleared = await clearPayloads(uniqueId, req.user._id);
    if (!cleared) {
      return res.status(404).json({
        success: false,
        message: "Endpoint not found",
      });
    }
    res.json({
      success: true,
      message: "Payloads cleared",
    });
  } catch (error) {
    next(error);
  }
};

const toggle = async (req, res, next) => {
  try {
    const { uniqueId } = req.params;
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }
    const endpoint = await toggleEndpoint(uniqueId, req.user._id, isActive);
    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: "Endpoint not found",
      });
    }
    res.json({
      success: true,
      message: `Endpoint ${isActive ? "activated" : "deactivated"}`,
      data: { isActive: endpoint.isActive },
    });
  } catch (error) {
    next(error);
  }
};

const getPayload = async (req, res, next) => {
  try {
    const { uniqueId, index } = req.params;
    const payload = await getPayloadById(
      uniqueId,
      parseInt(index),
      req.user._id,
    );
    if (!payload) {
      return res.status(404).json({
        success: false,
        message: "Payload not found",
      });
    }
    res.json({
      success: true,
      data: payload,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  receive,
  list,
  getOne,
  remove,
  clear,
  toggle,
  getPayload,
};
