const crypto = require("crypto");

const encryptValue = (token, value) => {
  try {
    const algorithm = "aes-256-cbc";
    const key = crypto.scryptSync(token, "salt", 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedValue = cipher.update(value, "utf-8", "hex");
    encryptedValue += cipher.final("hex");

    return iv.toString("hex") + encryptedValue;
  } catch (error) {
    handleAndLogError("encryptValue", error, (res = null));
  }
};
module.exports = encryptValue;
