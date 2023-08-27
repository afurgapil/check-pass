const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const authMiddleware = require("./middlewares/auth");
const deleteLog = require("./utils/cron/deleteLog");
const checkDate = require("./utils/cron/checkDate");
const encryptValue = require("./utils/functions/encryptValue");
const decryptValue = require("./utils/functions/decryptValue");
const handleAndLogError = require("./utils/functions/handleAndLogError");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
});
app.use(cors());
app.use(express.json());

// signup
app.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      passwords: [],
    });
    await user.save();
    res.status(201).json({ message: "User created succesfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
    handleAndLogError("/user/signup", error, res, user._id);
  }
});

// signin
app.post("/user/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Password error." });
    }

    const token = jwt.sign({ userId: user._id }, "key");
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
    handleAndLogError("/user/signin", error, res, user._id);
  }
});

//delete account
app.delete("/deleteAcc/:userId", authMiddleware, async (req, res) => {
  const userId = req.params.userId;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
    handleAndLogError("/deleteAcc/:userId", error, res, userId);
  }
});

//add item
app.post("/add/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { newPasswordName, newPasswordValue, newPasswordReceivers } = req.body;

  try {
    const user = await User.findById(userId);

    const encryptedValue = encryptValue(user.password, newPasswordValue);
    user.passwords.push({
      name: newPasswordName,
      value: encryptedValue,
      receivers: newPasswordReceivers,
    });
    const updatedUser = await user.save();

    res.status(201).json(updatedUser);
  } catch (error) {
    handleAndLogError("/add/:userId", error, res, userId);
  }
});

// get item
app.get("/get/:userId/", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const decryptedPasswords = user.passwords.map((password) => {
      const decryptedValue = decryptValue(user.password, password.value);

      return { ...password.toObject(), value: decryptedValue };
    });

    res.json(decryptedPasswords);
  } catch (error) {
    handleAndLogError("/get/:userId/:token", error, res, userId);
  }
});

//set item
app.put("/set/:id/", async (req, res) => {
  try {
    const userId = req.params.id;
    const { itemId, updatedPass } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const encryptedValue = encryptValue(user.password, updatedPass.value);
    const newPass = {
      name: updatedPass.name,
      value: encryptedValue,
      receivers: updatedPass.receivers,
    };
    const updatedPasswords = user.passwords.map((password) => {
      if (password._id.toString() === itemId) {
        return {
          ...password,
          ...newPass,
        };
      }
      return password;
    });

    user.passwords = updatedPasswords;

    const updatedUser = await user.save();

    res.status(201).json(updatedUser);
  } catch (error) {
    handleAndLogError("/set/:id/:token", error, res, (userId = null));
  }
});

// delete item
app.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const passToDelete = req.body.pass;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const updatedPass = user.passwords.filter(
      (pass) => pass._id.toString() !== passToDelete
    );
    user.passwords = updatedPass;
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete pass." });
    handleAndLogError("/set/:id", error, res, userId);
  }
});

// get user cycleDuration
app.get("/get-cycle/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.cycleDuration);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching cycle duration" });
    handleAndLogError("/get-cycle/:id", error, res, userId);
  }
});

//set user cycleDuration
app.put("/set-cycle/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { newCycle } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      cycleDuration: newCycle,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Can not updated" });
    handleAndLogError("/set-cycle/:id", error, res, userId);
  }
});

// get user nextControl
app.get("/get-nextControl/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.nextControl);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching nextControl " });
    handleAndLogError("/get-nextControl/:id", error, res, userId);
  }
});

//set user cycleDuration
app.put("/set-nextControl/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { newDate } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      nextControl: newDate,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Can not updated" });
    handleAndLogError("/set-nextControl/:id", error, res, userId);
  }
});

// get language
app.get("/get-lang/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.language);
  } catch (error) {
    console.error("Failed to fetch language:", error);
    res.status(500).json({ error: "Failed to fetch language." });
    handleAndLogError("/get-lang/:userId", error, res, userId);
  }
});

//set language
app.put("/set-lang/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { newLang } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      language: newLang,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Can not updated" });
    handleAndLogError("/set-lang/:id", error, res, userId);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
