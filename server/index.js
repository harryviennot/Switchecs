const express = require("express");
const http = require("http");
const cors = require("cors");

const SocketIo = require("./utils/socket");

require("dotenv").config();

(async () => {
  const app = express();
  app.use(cors());

  const server = http.createServer(app);
  SocketIo(server);

  server.listen(3001, () => {
    console.log("listening on port 3001");
  });
})();
