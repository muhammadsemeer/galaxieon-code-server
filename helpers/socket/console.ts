import { Namespace, Socket } from "socket.io";

export const consoleSocket = (io: Namespace, socket: Socket) => {
  socket.on("join", (id: string) => {
    socket.join(id);
    console.log("Console Enabled", id);
  });
  const methods = [
    "debug",
    "error",
    "info",
    "log",
    "warn",
    "dir",
    "dirxml",
    "table",
    "trace",
    "group",
    "groupCollapsed",
    "groupEnd",
    "clear",
    "count",
    "countReset",
    "assert",
    "profile",
    "profileEnd",
    "time",
    "timeLog",
    "timeEnd",
    "timeStamp",
    "context",
    "memory",
  ];
  methods.forEach((method) => {
    socket.on(method, (roomId, args: any[]) => {
      if (args.length === 0) {
        socket.to(`editor_${roomId}`).emit(`console.${method}`);
      }
      args.forEach((arg) => {
        socket.to(`editor_${roomId}`).emit(`console.${method}`, arg);
      });
    });
  });
};
