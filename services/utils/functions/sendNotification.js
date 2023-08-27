const sendEmail = require("./sendMail");
const decryptValue = require("./decryptValue");

const sendNotification = (user) => {
  const entries = user.passwords;
  const language = user.language;
  for (const entry of entries) {
    const name = entry.name;
    const value = entry.value;
    const decryptedValue = decryptValue(user.password, value);
    for (const receiver of entry.receivers) {
      sendEmail(user.username, receiver, name, decryptedValue, language);
    }
  }
};

module.exports = sendNotification;
