import fs from "fs";
import path from "path";

export const editCode = (
  fileName: string,
  instanceId: string,
  value: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
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
