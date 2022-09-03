const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdate = require("../../socketHandlers/updates/friends");

const postReject = async (req, res) => {
  try {
    const { id } = req.body;

    const { userId } = req.user;

    const response = await FriendInvitation.findByIdAndDelete(id);

    if (response) friendsUpdate.updatePendingFriendInvitations(userId);

    res.status(200).send("Invitation rejected.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong please try again.");
  }
};

module.exports = postReject;
