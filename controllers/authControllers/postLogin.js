const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const postLogin = async (req, res) => {
  const { mail, password } = req.body;

  try {
    const user = await User.findOne({ mail: mail });

    var match = false;

    if (user) match = await bcrypt.compare(password, user.password);

    if (user && match) {
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

      return res.status(200).json({
        userDetails: {
          mail: mail,
          username: user.username,
          token: token,
          _id: user._id,
        },
      });
    }

    return res.status(409).send("Invalid Credentials. Please try again.");
  } catch (err) {
    res.status(500).send(`error occured. ${err}`);
  }
};

module.exports = postLogin;
