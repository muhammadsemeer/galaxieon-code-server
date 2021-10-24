import fs from "fs";
import path from "path";
import { getInstanceById } from "./handle";

export const editCode = (
  fileName: string,
  instanceId: string,
  userId: string,
  value: string
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const instance = await getInstanceById(instanceId);
    if (instance.UserId !== userId) {
      reject("Forbidden");
    }
    let src = path.join(
      __dirname,
      "../../public/instances",
      instanceId,
      fileName
    );
    fs.writeFile(src, value, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
