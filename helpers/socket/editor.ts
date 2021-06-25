import { Namespace } from "socket.io";
import { editCode } from "../instance/codeHandler";
import { SocketWithCookies } from "./socket-cookie-parser";

export const editorSocket = (io: Namespace, socket: SocketWithCookies) => {
  socket.on("join", (instanceId) => {
    socket.join(instanceId);
  });
  socket.on("change", (file, value, instanceId, cb) => {
    editCode(file, instanceId, value)
      .then(() => {
        socket.broadcast.emit("change_by_other", value);
        cb(null, "OK");
      })
      .catch((err) => {
        cb(err, "FAIL");
      });
  });
};
