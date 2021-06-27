import { spawn } from "child_process";
import { SocketWithCookies } from "../socket/socket-cookie-parser";
import Executor, { exeCallBack } from "./base";

class CandCPPComplier extends Executor {
  constructor(
    public socket: SocketWithCookies,
    filename: string,
    ext: string,
    instanceId: string,
    private src: string
  ) {
    super(filename, instanceId, ext);
  }

  run(callback: exeCallBack): void {
    this.complie(callback);
  }

  private complie(callback: exeCallBack): void {
    const { fileName, ext, src } = this;
    const args = [`${fileName}.${ext}`, "-o", `${this.fileName}.out`];
    const compilerType = ext === "c" ? "gcc" : "g++";
    const compiler = spawn(compilerType, args, { cwd: src });
    compiler.stderr.on("data", (data) => {
      callback({ code: 1, message: data.toString() }); // 1, compile error
    });
    compiler.on("close", (data) => {
      if (data === 0) {
        this.execute(callback);
      }
    });
  }

  private execute(callback: exeCallBack) {
    const { fileName, src, socket } = this;
    const executor = spawn(`./${fileName}.out`, { cwd: src });
    let count = 0;
    executor.stdout.on("data", async (data) => {
      const call = (): Promise<string> => {
        return new Promise((resolve, reject) => {
          socket.emit("input", ++count, (value: any) =>
            resolve(value.toString())
          );
        });
      };
      callback(null, data.toString());
      let input = await call();
      executor.stdin.write(input + "\n");
    });
    executor.stdin.on("error", (err) => {
      callback({ code: 1, message: err.message });
      executor.kill();
    });
    executor.stderr.on("data", (data) => callback(null, data.toString()));
    executor.on("error", (err) => callback({ code: 1, message: err.message }));
    executor.on("exit", (code) => {
      callback(null, `\nprocess exited with code ${code}`);
      executor.stdin.end();
    });
  }
}

export default CandCPPComplier;
