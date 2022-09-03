const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdate = require("../../socketHandlers/updates/friends");
const User = require("../../models/user");

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;

    const { userId } = req.user;

    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return res.status(401).send("Error occured. Please try again.");
    }

    const { senderId, receiverId } = invitation;

    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    const r1 = await senderUser.save();
    const r2 = await receiverUser.save();

    const response = await FriendInvitation.findByIdAndDelete(id);

    if (r1) friendsUpdate.updateFriends(receiverId.toString());
    if (r2) friendsUpdate.updateFriends(senderId.toString());

    if (response) friendsUpdate.updatePendingFriendInvitations(userId);

    return res.status(200).send("Invitation accepted.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong please try again.");
  }
};

module.exports = postAccept;
