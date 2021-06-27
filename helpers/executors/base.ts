export type exeCallBack = (
  err: { code: number; message: string } | null,
  result?: string
) => void;

class Executor {
  public fileName: string;
  constructor(fileName: string, public instanceId: string, public ext: string) {
    let splittedArray = fileName.split(".");
    splittedArray.pop();
    this.fileName = splittedArray.join(".");
  }
}

export default Executor;
