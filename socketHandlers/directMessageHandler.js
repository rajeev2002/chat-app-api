const Conversation = require("../models/conversation");
const Message = require("../models/message");
const chatUpdates = require("../socketHandlers/updates/chat");

const directMessageHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;

    const { receiverUserId, content } = data;

    const message = await Message.create({
      content: content,
      author: userId,
      date: new Date(),
      type: "DIRECT",
    });

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });

    if (conversation) {
      conversation.messages.push(message._id);
      const updateConversation = await conversation.save();

      if (updateConversation)
        chatUpdates.updateChatHistory(conversation._id.toString());
    } else {
      const newConversation = await Conversation.create({
        messages: [message._id],
        participants: [userId, receiverUserId],
      });

      if (newConversation)
        chatUpdates.updateChatHistory(newConversation._id.toString());
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = directMessageHandler;
