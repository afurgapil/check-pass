const mongoose = require("mongoose");
const passwordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  receivers: [
    {
      type: String,
      required: true,
    },
  ],
});
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cycleDuration: { type: Number, required: true, default: 7 },
  nextControl: {
    type: Date,
    required: true,
    default: () => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 7);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
  passwords: [passwordSchema],
  language: { type: String, required: true, default: "gb" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
