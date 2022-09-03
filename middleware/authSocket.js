const jwt = require("jsonwebtoken");

module.exports = (socket, next) => {
  const token = socket.handshake.auth?.token;
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    socket.user = decoded;
  } catch (err) {
    const socketError = new Error("NOT AUTHORIZED");
    return next(socketError);
  }

  next();
};
