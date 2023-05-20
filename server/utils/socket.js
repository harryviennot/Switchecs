const socketIo = require("socket.io");

const SocketIo = (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = SocketIo;
