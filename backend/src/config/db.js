// backend/src/config/db.js
const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri); // No options needed in Mongoose 7+
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB connect failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
