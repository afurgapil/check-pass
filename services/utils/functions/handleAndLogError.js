const ErrorLog = require("../../models/errorLog");

const handleAndLogError = (operation, error, res, userId = null) => {
  const errorLog = new ErrorLog({
    operation,
    error: error.message,
    userId: userId,
  });
  errorLog.save();

  res.status(500).json({ error: "An error occurred." });
};
module.exports = handleAndLogError;
