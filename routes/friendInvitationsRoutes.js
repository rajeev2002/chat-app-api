const router = require("express").Router();
const joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth");
const friendInvitationControllers = require("../controllers/friendInvitationControllers/friendInvitationControllers");

const friendInvitationValidationSchema = joi.object({
  targetMailAddress: joi.string().email().required(),
});

const inviteDecisionValidationSchema = joi.object({
  id: joi.string().required(),
});

router.post(
  "/invite",
  auth,
  validator.body(friendInvitationValidationSchema),
  friendInvitationControllers.postInvite
);

router.post(
  "/accept",
  auth,
  validator.body(inviteDecisionValidationSchema),
  friendInvitationControllers.postAccept
);

router.post(
  "/reject",
  auth,
  validator.body(inviteDecisionValidationSchema),
  friendInvitationControllers.postReject
);

module.exports = router;
