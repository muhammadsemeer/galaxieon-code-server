import { Namespace } from "socket.io";
import { editCode } from "../instance/codeHandler";
import compile from "../instance/compile";
import { edited } from "../instance/handle";
import { SocketWithCookies } from "./socket-cookie-parser";

export const editorSocket = (io: Namespace, socket: SocketWithCookies) => {
  var id: string;
  var isChangesMade: boolean;
  socket.on("join", (instanceId) => {
    socket.join(instanceId);
    id = instanceId;
    console.log("Editor connected to instance: " + instanceId);
  });
  socket.on("change", (file, value, instanceId, cb) => {
    editCode(file, instanceId, value)
      .then(() => {
        isChangesMade = true;
        socket.broadcast.emit("change_by_other", value);
        cb(null, "OK");
      })
      .catch((err) => {
        cb(err, "FAIL");
      });
  });

  socket.on("execute", (file, instanceId) => {
    compile(file, instanceId, socket, (err, result) => {
      socket.emit("exe_result", err, result);
    });
  });

  socket.on("disconnect", async () => {
    try {
      isChangesMade && (await edited(id));
    } catch (error) {
      console.log(error);
    }
  });
};
