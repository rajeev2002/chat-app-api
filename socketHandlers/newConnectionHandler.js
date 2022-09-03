const { addConnectedUser } = require("../serverStore");
const friendsUpdate = require("./updates/friends");

const newConnectionHandler = (socket, io) => {
  addConnectedUser({
    socketId: socket.id,
    userId: socket.user.userId,
  });

  friendsUpdate.updateFriends(socket.user.userId);

  friendsUpdate.updatePendingFriendInvitations(socket.user.userId);
};
module.exports = newConnectionHandler;
