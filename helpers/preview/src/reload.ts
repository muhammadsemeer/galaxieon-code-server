import io from "socket.io-client";

const socket = io("/liveReload");
const id = document
  .querySelector(`[src='${process.env.URL}/api/static/gcode/utils.js']`)
  ?.getAttribute("data-id");

socket.on("connect", () => {
  if (Boolean(!sessionStorage.getItem("isFirstTime"))) {
    console.log("Live Reload Enabled");
    sessionStorage.setItem("isFirstTime", "true");
  }
  socket.emit("watch", id);
});

socket.on("changes", () => location.reload());
