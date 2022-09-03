const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const postRegister = async (req, res) => {
  const { mail, username, password } = req.body;

  try {
    const userExists = await User.findOne({ mail: mail });

    if (userExists) return res.status(409).send("User already exists.");

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      mail: mail,
      username: username,
      password: encryptedPassword,
    });

    const user = await newUser.save();

    const token = jwt.sign(
      {
        userId: user._id,
        mail,
      },
      process.env.PRIVATE_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      userDetails: {
        mail: mail,
        username: username,
        token: token,
        _id: user._id,
      },
    });
  } catch (err) {
    res.status(500).send(`error occured. ${err}`);
  }
};

module.exports = postRegister;
