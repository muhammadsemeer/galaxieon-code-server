import { spawn } from "child_process";
import Executor, { exeCallBack } from "./base";

class CandCPPComplier extends Executor {
  constructor(
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
    const { fileName, src } = this;
    const executor = spawn(`./${fileName}.out`, { cwd: src });
    executor.stdout.on("data", (data) => {
      //  executor.stdin.write();
      callback(null, data.toString());
      executor.stdin.end();
      executor.kill();
    });
    executor.stdin.on("error", (err) => {
      callback({ code: 1, message: err.message });
      executor.kill();
    });
    executor.stderr.on("data", (data) => callback(null, data.toString()));
    executor.on("error", (err) => callback({ code: 1, message: err.message }));
    executor.on("exit", (code) => {
      callback(null, `Process exited with ${code}`);
    });
  }
}

export default CandCPPComplier;
