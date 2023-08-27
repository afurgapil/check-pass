const mongoose = require("mongoose");

const errorLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  operation: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    default: null,
  },
});

const ErrorLog = mongoose.model("ErrorLog", errorLogSchema);

module.exports = ErrorLog;
