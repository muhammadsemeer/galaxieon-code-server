import { Namespace, Socket } from "socket.io";
import { SocketWithCookies } from "./socket-cookie-parser";

export const editorSocket = (io: Namespace, socket: SocketWithCookies) => {
  socket.on("join", (instanceId) => {
    console.log(instanceId, "Joined");
    socket.join(instanceId);
  });
};
