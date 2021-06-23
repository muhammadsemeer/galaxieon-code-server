import http from "http";
import app from "./app";
import chalk from "chalk";
import db from "./config/dbconnection";

import "./models/User";
import "./models/Template";
import "./models/Instance";

// Creating http server
const server = http.createServer(app);

// Setting PORT
const PORT = process.env.PORT || 3001;
app.set("port", PORT);

server.listen(PORT);

server.on("listening", listen)

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
      chalk.yellowBright(process.pid),
      chalk.cyanBright("UP and running on "),
      chalk.yellowBright(PORT)
    );
  });
}
