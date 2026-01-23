const SUPPORTED_CURRENCIES = new Set([
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
  "BRL",
  "KRW",
  "MXN",
  "SGD",
  "HKD",
  "NZD",
  "SEK",
  "NOK",
  "DKK",
  "ZAR",
  "RUB",
]);

const MAX_SAFE_VALUE = Number.MAX_SAFE_INTEGER;
const MIN_SAFE_VALUE = -Number.MAX_SAFE_INTEGER;

const sanitizeNumber = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    if (!cleaned || cleaned === "-" || cleaned === ".") return null;
    value = cleaned;
  }
  const numValue = Number(value);
  if (isNaN(numValue) || !isFinite(numValue)) return null;
  if (numValue > MAX_SAFE_VALUE || numValue < MIN_SAFE_VALUE) return null;

  return numValue;
};

const validateCurrency = (currency) => {
  if (typeof currency !== "string") return "USD";
  const upper = currency.toUpperCase().trim();
  return SUPPORTED_CURRENCIES.has(upper) ? upper : "USD";
};

export const formatCurrency = (value, currency = "USD", locale = "en-US") => {
  const numValue = sanitizeNumber(value);
  if (numValue === null) return "$0.00";
  const validCurrency = validateCurrency(currency);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: validCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  } catch {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: validCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  }
};

export const formatCompactCurrency = (value, currency = "USD") => {
  const numValue = sanitizeNumber(value);
  if (numValue === null) return "$0";

  const absValue = Math.abs(numValue);
  const sign = numValue < 0 ? "-" : "";
  const validCurrency = validateCurrency(currency);
  const symbol =
    validCurrency === "USD" ? "$" : validCurrency === "EUR" ? "€" : "$";

  if (absValue >= 1e12) {
    return `${sign}${symbol}${(absValue / 1e12).toFixed(1)}T`;
  }
  if (absValue >= 1e9) {
    return `${sign}${symbol}${(absValue / 1e9).toFixed(1)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}${symbol}${(absValue / 1e6).toFixed(1)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}${symbol}${(absValue / 1e3).toFixed(1)}K`;
  }
  return `${sign}${symbol}${absValue.toFixed(2)}`;
};

export const formatCostPerRequest = (value, precision = 4) => {
  const numValue = sanitizeNumber(value);
  if (numValue === null) return "$0.0000";
  const safePrecision = Math.max(2, Math.min(8, Math.floor(precision)));

  return `$${numValue.toFixed(safePrecision)}`;
};

export const formatPercentageChange = (value) => {
  const numValue = sanitizeNumber(value);
  if (numValue === null) return "0%";
  const sign = numValue > 0 ? "+" : "";
  return `${sign}${numValue.toFixed(1)}%`;
};

export const parseCurrency = (currencyString) => {
  if (!currencyString || typeof currencyString !== "string") return 0;
  const cleaned = currencyString.replace(/[^0-9.-]/g, "");
  const numValue = sanitizeNumber(cleaned);

  return numValue ?? 0;
};
