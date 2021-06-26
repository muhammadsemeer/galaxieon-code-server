import { Namespace } from "socket.io";
import { editCode } from "../instance/codeHandler";
import { edited } from "../instance/handle";
import { SocketWithCookies } from "./socket-cookie-parser";

export const editorSocket = (io: Namespace, socket: SocketWithCookies) => {
  var id: string;
  socket.on("join", (instanceId) => {
    socket.join(instanceId);
    id = instanceId;
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

  socket.on("disconnect", async () => {
    try {
      await edited(id);
    } catch (error) {
      console.log(error);
    }
  });
};
