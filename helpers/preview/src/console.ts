import io from "socket.io-client";

const script = document.querySelector(
  `[src='${process.env.URL}/api/static/gcode/utils.js']`
);

const id = script?.getAttribute("data-id");
const isIframe = window.location !== window.parent.location;

const socket = io("/console");
if (isIframe) {
  const nativeConsole: { [index: string]: Function } = { ...console };
  socket.on("connect", () => {
    socket.emit("join", id);
  });

  for (let key in nativeConsole) {
    console[key] = (...args: any[]) => {
      socket.emit(key, id, args);
      nativeConsole[key](...args);
    };
  }
} else {
  socket.disconnect();
}
