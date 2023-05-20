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
        games[room] = {
          chess: new Chess(),
          turn: "white",
          switchTurnsIn: Math.floor(Math.random() * 3) + 3,
        };
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
      if (!game) {
        console.error(`Game not found for room: ${room}`);
        return;
      }
      socket.emit("update", { fen: game.chess.fen(), turn: game.turn });
    });

    socket.on("move", (move, room) => {
      const game = games[room];

      console.log("FEN before move: ", game.chess.fen());
      console.log("move", move, room);

      if (!game) {
        console.error(`Game not found for room: ${room}`);
        return;
      }
      try {
        const result = game.chess.move(move);
        game.turn === "white" ? (game.turn = "black") : (game.turn = "white");
        if (result) {
          if (game.chess.in_checkmate()) {
            io.to(room).emit(
              "game won",
              game.turn === "white" ? "black" : "white"
            );
          }
          io.to(room).emit("update", {
            fen: game.chess.fen(),
            turn: game.turn,
          });
          game.switchTurnsIn--;
        } else {
          socket.emit("invalid move", move);
        }
        if (game.switchTurnsIn === 0) {
          io.to(room).emit("switch turns");
          console.log("switch turns");
          game.switchTurnsIn = Math.floor(Math.random() * 6) + 2;
        }
      } catch (e) {
        console.error(e);
        socket.emit("invalid move", move);
      }
    });

    socket.on("leave", (room) => {
      console.log("leave", room);
      socket.leave(room);
      io.to(room).emit("userLeft", room);
      logClientsInRoom(room);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = SocketIo;
