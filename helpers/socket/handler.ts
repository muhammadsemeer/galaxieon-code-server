import { cyanBright, yellowBright } from "chalk";
import { Server, Socket } from "socket.io";

export const connection = (socket: Socket, io: Server) => {
  console.log(
    cyanBright("Socket"),
    yellowBright(socket.id),
    cyanBright("Connected")
  );
};
