import http from "http";
import app from "./app";
import chalk from "chalk";
import db from "./config/dbconnection";
import { Server } from "socket.io";

import "./models/User";
import "./models/Template";
import "./models/Instance";
import { connection } from "./helpers/socket/handler";

// Creating http server
const server = http.createServer(app);

// Setting PORT
const PORT = process.env.PORT || 3001;
app.set("port", PORT);

server.listen(PORT);

// Socket io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => connection(socket, io));

server.on("listening", listen);

// Handle Listen
async function listen() {
  // Database connection
  db.authenticate()
    .then(() => console.log("Database Connected"))
    .catch((err: Error) => console.log("Connection Error:", err));
  db.sync().then(() => {
    //   Server listen
    console.log(
      chalk.cyanBright("Server "),
      chalk.cyanBright("UP and running on "),
      chalk.yellowBright(PORT)
    );
  });
}
