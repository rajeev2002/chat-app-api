const router = require("express").Router();
const authControllers = require("../controllers/authControllers/authControllers");
const joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth");

const registerValidationSchema = joi.object({
  mail: joi.string().email().required(),
  username: joi.string().min(3).max(12).required(),
  password: joi.string().min(8).max(12).required(),
});

const loginValidationSchema = joi.object({
  mail: joi.string().email().required(),
  password: joi.string().min(8).max(12).required(),
});

router.post(
  "/register",
  validator.body(registerValidationSchema),
  authControllers.postRegister
);
router.post(
  "/login",
  validator.body(loginValidationSchema),
  authControllers.postLogin
);

module.exports = router;
