const FriendInvitation = require("../../models/friendInvitation");
const User = require("../../models/user");
const friendsUpdate = require("../../socketHandlers/updates/friends");

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;

  const { userId, mail } = req.user;

  if (targetMailAddress === mail) {
    return res
      .status(409)
      .send("Sorry. You Cannot send friend invitation for yourself.");
  }

  const targetUser = await User.findOne({ mail: targetMailAddress });

  if (!targetUser) {
    return res
      .status(409)
      .send(
        `Sorry. ${targetMailAddress} does not exist. Please check the mail.`
      );
  }

  const invitationAlreadySent = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });

  if (invitationAlreadySent) {
    return res
      .status(409)
      .send("Sorry. The invitation has already been sent previously.");
  }

  const usersAlreadyFriends = await targetUser.friends.find(
    (friendId) => friendId.toString() === userId.toString()
  );

  if (usersAlreadyFriends) {
    return res
      .status(409)
      .send(
        `${targetMailAddress} is already your friend. Please check the friends list.`
      );
  }

  const invitationAlreadySentByReceiver = await FriendInvitation.findOne({
    senderId: targetUser._id,
    receiverId: userId,
  });

  if (invitationAlreadySentByReceiver) {
    return res
      .status(409)
      .send(
        `${targetMailAddress} with username ${targetUser.username} has already sent you an invitation,`
      );
  }

  const newFriendInvitation = new FriendInvitation({
    senderId: userId,
    receiverId: targetUser._id,
  });

  const data = await newFriendInvitation.save();

  friendsUpdate.updatePendingFriendInvitations(targetUser._id.toString());

  res.status(200).send("Invitation sent successfully.");
};

module.exports = postInvite;
