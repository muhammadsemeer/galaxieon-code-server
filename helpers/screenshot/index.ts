import { getInstanceById } from "../instance/handle";
import puppeteer from "puppeteer";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

const screenshot = (id: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      let instance = await getInstanceById(id, ["subdomain"]);
      if (!instance.subdomain) return reject({ status: 204 });
      let url = `https://${instance.subdomain}.code.galaxieon.com`;
      let path = join(__dirname, "../../public/screenshots/");
      if (!existsSync(path)) mkdirSync(path);
      const browser = await puppeteer.launch({
        args: ["--ignore-certificate-errors"],
      });
      const page = await browser.newPage();
      await page.goto(url);
      await page.screenshot({ path: path + id + ".png" });
      await browser.close();
      resolve(`/public/screenshots/${id}.png`);
    } catch (error) {
      reject(error);
    }
  });
};

export default screenshot;
