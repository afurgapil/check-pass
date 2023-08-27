const ErrorLog = require("../../models/errorLog");
const cron = require("node-cron");

const deleteLog = async () => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    await ErrorLog.deleteMany({ createdAt: { $lt: oneWeekAgo } });
    console.log("Automatic cleaning process completed.");
  } catch (error) {
    handleAndLogError("DELETE CRON ERROR", error, (res = null));
  }
};

cron.schedule("0 0 * * *", deleteLog);
