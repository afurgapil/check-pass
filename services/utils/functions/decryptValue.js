const crypto = require("crypto");

const decryptValue = (token, encryptedValue) => {
  try {
    const algorithm = "aes-256-cbc";
    const key = crypto.scryptSync(token, "salt", 32);
    const iv = Buffer.from(encryptedValue.slice(0, 32), "hex");
    encryptedValue = encryptedValue.slice(32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedValue = decipher.update(encryptedValue, "hex", "utf-8");
    decryptedValue += decipher.final("utf-8");

    return decryptedValue;
  } catch (error) {
    handleAndLogError("decryptValue", error, (res = null));
  }
};

module.exports = decryptValue;
