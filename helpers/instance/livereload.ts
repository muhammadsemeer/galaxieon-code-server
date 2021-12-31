import fs from "fs";
import path from "path";
import { Namespace, Socket } from "socket.io";
import { parse } from "node-html-parser";
import { getInstanceById } from "./handle";
import chokidar from "chokidar";
import { EventEmitter } from "events";

const liveReload = (src: string, id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(src, "utf8", (err, html) => {
      if (err) return reject(err);

      const document = parse(html);

      const body = document.querySelector("body");
      let script = parse(
        `<script src="${process.env.URL}/api/static/gcode/utils.js" data-id=${id}></script>`
      );
      body?.appendChild(script);

      resolve(document.toString());
    });
  });
};

export default liveReload;

export const liveReloadSocket = (io: Namespace, socket: Socket) => {
  socket.on("watch", (id: string) => {
    socket.join(id);
    let changes = watchFiles(id);
    changes
      .on("changes", () => {
        socket.emit("changes");
      })
      .on("error", (err) => socket.emit("err"));
    socket.on("disconnect", () => {
      changes.emit("close");
    });
  });
};

export function watchFiles(id: string): EventEmitter {
  let watcher = new EventEmitter();
  try {
    let src = path.join(__dirname, "../../public/instances", id);
    let watch = chokidar.watch(src).on("change", (event, path) => {
      setTimeout(() => watcher.emit("changes"), 500);
    });
    watcher.on("close", () => watch.close());
  } catch (error) {
    watcher.emit("error", error);
  }
  return watcher;
}
