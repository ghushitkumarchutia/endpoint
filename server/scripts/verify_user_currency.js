const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../models/User");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const verifyUser = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    // The ID from the user's logs
    const userId = "6978759afee3393b6c826a28";

    console.log(`Searching for user: ${userId}`);
    const user = await User.findById(userId).lean();

    if (!user) {
      console.log("User NOT FOUND in DB.");
    } else {
      console.log("User Found.");
      console.log("User Name:", user.name);
      console.log("Cost Settings:", JSON.stringify(user.costSettings, null, 2));

      if (user.costSettings?.currency === "INR") {
        console.log(
          "SUCCESS: Currency is correctly stored as INR in the database.",
        );
      } else {
        console.log(
          "FAILURE: Currency is NOT INR. Stored value:",
          user.costSettings?.currency,
        );
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

verifyUser();
