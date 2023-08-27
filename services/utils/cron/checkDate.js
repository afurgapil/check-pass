const User = require("../../models/user");
const cron = require("node-cron");
const sendNotification = require("../functions/sendNotification");
const formatDate = require("../functions/formatDate");
const handleAndLogError = require("../functions/handleAndLogError");
const checkDate = async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      const nextControlFormattedDate = formatDate(user.nextControl);
      const currentDateFormatted = formatDate(new Date());
      const remainingTime = nextControlFormattedDate - currentDateFormatted;
      if (remainingTime == 10) {
        sendNotification(user);
      }
    }
  } catch (error) {
    handleAndLogError("CHECK CRON ERROR", error, (res = null));
  }
};
cron.schedule("0 0 * * *", checkDate);
