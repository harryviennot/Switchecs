const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const SocketIo = require("./utils/socket");

(async () => {
  const app = express();
  app.use(cors());

  const server = http.createServer(app);
  SocketIo(server);

  server.listen(process.env.PORT || 3001, () => {
    console.log("listening on port 3001");
  });
})();
