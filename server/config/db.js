const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Connection pool settings for high traffic
      maxPoolSize: 100, // Maximum number of connections in the pool
      minPoolSize: 10, // Minimum number of connections
      maxIdleTimeMS: 30000, // Close idle connections after 30 seconds
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Timeout for socket operations
      connectTimeoutMS: 10000, // Timeout for initial connection
      retryWrites: true, // Retry failed writes
      retryReads: true, // Retry failed reads
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected successfully");
    });
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown helper
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed gracefully");
  } catch (error) {
    console.error(`Error closing MongoDB connection: ${error.message}`);
  }
};

module.exports = { connectDB, closeDB };
