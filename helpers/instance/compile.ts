import path from "path";
import { exeCallBack } from "../executors/base";
import CandCPPComplier from "../executors/cAndCpp";
import { SocketWithCookies } from "../socket/socket-cookie-parser";

const compile = (
  fileName: string,
  instanceId: string,
  socket:SocketWithCookies,
  callback: exeCallBack
): void => {
  let splittedArray = fileName.split(".");
  let ext = splittedArray[splittedArray.length - 1];
  let src = path.join(__dirname, "../../public/instances", instanceId);
  let compiler = new CandCPPComplier(socket,fileName, ext, instanceId, src);
  compiler.run((err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

export default compile;
