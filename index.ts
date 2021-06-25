import http from "http";
import app from "./app";
import chalk from "chalk";
import db from "./config/dbconnection";
import { Server } from "socket.io";

import "./models/User";
import "./models/Template";
import "./models/Instance";
import { connection } from "./helpers/socket/handler";
import { liveReloadSocket } from "./helpers/instance/livereload";
import { editorSocket } from "./helpers/socket/editor";
import cookieParser from "./helpers/socket/socket-cookie-parser";
import { verifyTokenSocket } from "./auth/token";

// Creating http server
const server = http.createServer(app);

// Setting PORT
const PORT = process.env.PORT || 3001;
app.set("port", PORT);

server.listen(PORT);

app.disable("x-powered-by");
// Socket io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => connection(socket, io));
let liveReload = io.of("/liveReload");
liveReload.on("connection", (socket) => liveReloadSocket(liveReload, socket));
let editor = io.of("/editor");
editor.use(cookieParser);
editor.use(verifyTokenSocket)
editor.on("connection", (socket) => editorSocket(editor, socket));

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
