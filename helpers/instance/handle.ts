import { copy } from "fs-extra";
import path from "path";
import Instance from "../../models/Instance";
import Template from "../../models/Template";
import { Instance as InstanceType } from "../../types/Instance";
import { Template as TemplateType } from "../../types/Template";

export const copyFolder = (from: string, to: string): Promise<void> => {
  return new Promise((resolve, reject) =>
    copy(from, to, (err) => {
      if (err) return reject(err);
      resolve();
    })
  );
};

export const createInstance = (
  userId: string,
  templateId: string,
  data: InstanceType
): Promise<InstanceType> => {
  return new Promise(async (resolve, reject) => {
    try {
      let template: TemplateType = await Template.findByPk(templateId, {
        attributes: ["name", "files"],
        raw: true,
      });

      let newInstance: InstanceType = await Instance.create({
        ...data,
        files: template.files,
      });
      let from = path.join(
        __dirname,
        "../../public/templates/",
        template.name.toLowerCase()
      );
      let to = path.join(__dirname, "../../public/instances/", newInstance.id);
      await copyFolder(from, to);
      resolve(newInstance);
    } catch (error) {
      reject(error);
    }
  });
};

const defaultExports = { createInstance, copyFolder };

export default defaultExports;
