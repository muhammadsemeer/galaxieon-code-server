import Template from "../../models/Template";
import { Template as TemplateType } from "../../types/Template";

export const getTemplates = (): Promise<TemplateType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      let templates: TemplateType[] = await Template.findAll(
        {
          where: {
            status: true,
          },
        },
        { raw: true }
      );
      resolve(templates);
    } catch (error) {
      reject(error);
    }
  });
};

const defaults = { getTemplates };

export default defaults;
