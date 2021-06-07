import http from "http";
import app from "./app";
import cluster from "cluster";
import os from "os";
import chalk from "chalk";

// Creating http server
const server = http.createServer(app);

// Setting PORT
const PORT = process.env.PORT || 3001;
app.set("port", PORT);

const numCpus = os.cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCpus; i++) {
    cluster.fork();
  }
} else {
  listen();
}

cluster.on("exit", (worker, code, signal) => {
  console.log(
    chalk.cyanBright("Worker "),
    chalk.yellowBright(worker.process.pid),
    chalk.cyanBright("Died")
  );

  if (!code) {
    cluster.fork();
  }
});

// Handle Listen
function listen() {
  server.listen(PORT);
  server.on("listening", () =>
    console.log(
      chalk.cyanBright("Server "),
      chalk.yellowBright(process.pid),
      chalk.cyanBright("UP and running on "),
      chalk.yellowBright(PORT)
    )
  );
}
