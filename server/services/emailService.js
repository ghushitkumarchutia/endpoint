const nodemailer = require("nodemailer");

// Email configuration
const EMAIL_CONFIG = {
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000,
  TIMEOUT: 10000, // 10 seconds
};

let transporter = null;

/**
 * Get or create email transporter (lazy initialization)
 */
const getTransporter = () => {
  if (!transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      pool: true, // Use pooled connections
      maxConnections: 5,
      maxMessages: 100,
      socketTimeout: EMAIL_CONFIG.TIMEOUT,
    });
  }
  return transporter;
};

/**
 * Send email with retry logic
 */
const sendEmailWithRetry = async (mailOptions, retryCount = 0) => {
  const transport = getTransporter();
  if (!transport) {
    console.warn("Email service not configured - skipping email");
    return null;
  }

  try {
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    if (retryCount < EMAIL_CONFIG.MAX_RETRIES) {
      // Retry on transient errors
      if (
        error.code === "ECONNECTION" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ESOCKET" ||
        error.responseCode >= 500
      ) {
        await new Promise((r) =>
          setTimeout(r, EMAIL_CONFIG.RETRY_DELAY * (retryCount + 1)),
        );
        return sendEmailWithRetry(mailOptions, retryCount + 1);
      }
    }
    console.error("Email send failed:", error.message);
    throw error;
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"Endpoint" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested a password reset for your Endpoint account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
        <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  return sendEmailWithRetry(mailOptions);
};

const sendAnomalyAlertEmail = async (email, apiName, anomalyType, severity) => {
  const mailOptions = {
    from: `"Endpoint Alerts" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `[${severity.toUpperCase()}] Alert: ${apiName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${severity === "high" ? "#DC2626" : "#F59E0B"};">API Anomaly Detected</h2>
        <p><strong>API:</strong> ${apiName}</p>
        <p><strong>Issue:</strong> ${anomalyType.replace(/_/g, " ")}</p>
        <p><strong>Severity:</strong> ${severity}</p>
        <p>Log in to your dashboard to view details and AI insights.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">View Dashboard</a>
      </div>
    `,
  };

  return sendEmailWithRetry(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
  sendAnomalyAlertEmail,
};
