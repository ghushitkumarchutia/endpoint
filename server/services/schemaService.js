const Ajv = require("ajv");

const generateSchema = (obj) => {
  if (obj === null || obj === undefined) {
    return { type: "null" };
  }

  const type = Array.isArray(obj) ? "array" : typeof obj;

  if (type === "object") {
    const properties = {};
    const required = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        properties[key] = generateSchema(obj[key]);
        required.push(key);
      }
    }

    return {
      type: "object",
      properties,
      required,
    };
  }

  if (type === "array") {
    if (obj.length === 0) {
      return { type: "array", items: {} };
    }
    return {
      type: "array",
      items: generateSchema(obj[0]),
    };
  }

  return { type };
};

const compareSchemas = (baseline, current) => {
  const changes = [];

  const compare = (base, curr, path = "") => {
    if (!base || !curr) return;

    if (base.type !== curr.type) {
      changes.push({
        path: path || "root",
        change: "type_changed",
        from: base.type,
        to: curr.type,
      });
      return;
    }

    if (base.type === "object" && curr.type === "object") {
      const baseKeys = Object.keys(base.properties || {});
      const currKeys = Object.keys(curr.properties || {});

      for (const key of currKeys) {
        if (!baseKeys.includes(key)) {
          changes.push({
            path: path ? `${path}.${key}` : key,
            change: "field_added",
            type: curr.properties[key].type,
          });
        }
      }

      for (const key of baseKeys) {
        if (!currKeys.includes(key)) {
          changes.push({
            path: path ? `${path}.${key}` : key,
            change: "field_removed",
            type: base.properties[key].type,
          });
        } else {
          compare(
            base.properties[key],
            curr.properties[key],
            path ? `${path}.${key}` : key,
          );
        }
      }
    }
  };

  compare(baseline, current);
  return changes;
};

module.exports = {
  generateSchema,
  compareSchemas,
};
