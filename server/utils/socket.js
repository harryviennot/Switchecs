const socketIo = require("socket.io");
const Chess = require("chess.js").Chess;

const games = {};

const SocketIo = (server) => {
  const io = socketIo(server);

  function logClientsInRoom(roomName) {
    const clientsInRoom = Array.from(
      io.sockets.adapter.rooms.get(roomName) || []
    );
    const activeRooms = Array.from(io.sockets.adapter.rooms) || [];
    console.log(`Clients in room ${roomName}:`, clientsInRoom);
    console.log("Active rooms:", activeRooms);
  }

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("join", (room) => {
      console.log("join", room);
      const clients = io.sockets.adapter.rooms.get(room) || [];
      if (clients.size === 2) {
        socket.emit("full", room);
        return;
      }
      if (!games[room]) {
        games[room] = new Chess();
      }
      socket.join(room);
      socket.emit("joined", room);
      logClientsInRoom(room);
    });

    socket.on("getColor", (room) => {
      const clients = io.sockets.adapter.rooms.get(room) || [];
      let color = "white";
      if (clients.size === 2) {
        color = "black";
      }
      socket.emit("color", color);
    });

    socket.on("getFen", (room) => {
      const game = games[room];
      socket.emit("update", game.fen());
    });

    socket.on("move", (move, room) => {
      const game = games[room];
      const result = game.move(move);
      if (result) {
        io.to(room).emit("update", game.fen());
      } else {
        socket.emit("invalid move", move);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = SocketIo;
