import Template from "../../models/Template";
import { Template as TemplateType } from "../../types/Template";

export const getTemplates = (): Promise<TemplateType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      let templates: TemplateType[] = await Template.findAll(
        { status: true },
        { raw: true }
      );
      // resolve(templates);
      throw new Error("Error");
    } catch (error) {
      reject(error);
    }
  });
};

const defaults = { getTemplates };

export default defaults;
