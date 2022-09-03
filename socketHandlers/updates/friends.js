const FriendInvitation = require("../../models/friendInvitation");
const serverStore = require("../../serverStore");
const User = require("../../models/user");

const updatePendingFriendInvitations = async (userId) => {
  try {
    const activeConnections = serverStore.getActiveConnections(userId);

    if (activeConnections.length > 0) {
      const pendingInvitations = await FriendInvitation.find({
        receiverId: userId,
      }).populate("senderId", "_id username mail");

      const io = serverStore.getSocketServerInstance();

      activeConnections.forEach((connection) => {
        io.to(connection).emit("friends-invitations", {
          pendingInvitations: pendingInvitations ? pendingInvitations : [],
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const updateFriends = async (userId) => {
  try {
    const activeConnections = serverStore.getActiveConnections(userId);

    if (activeConnections.length > 0) {
      const user = await User.findById(userId, { _id: 1, friends: 1 }).populate(
        "friends",
        "_id username mail"
      );

      if (user) {
        const friendsList = user.friends.map((friend) => {
          return {
            id: friend._id,
            mail: friend.mail,
            username: friend.username,
          };
        });

        const io = serverStore.getSocketServerInstance();

        activeConnections.forEach((connection) => {
          io.to(connection).emit("friends", {
            friends: friendsList ? friendsList : [],
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { updatePendingFriendInvitations, updateFriends };
