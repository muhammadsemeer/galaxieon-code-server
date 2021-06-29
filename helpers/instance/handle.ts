import fs from "fs";
import { copy } from "fs-extra";
import path from "path";
import Instance from "../../models/Instance";
import Template from "../../models/Template";
import User from "../../models/User";
import { Instance as InstanceType } from "../../types/Instance";
import { Template as TemplateType } from "../../types/Template";
import { Op } from "sequelize";

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
        attributes: ["name", "files", "language", "used"],
        raw: true,
      });
      let tempConfig = template.language.includes("HTML")
        ? { files: template.files, subdomain: Date.now().toString(36) }
        : { files: template.files };
      let newInstance: InstanceType = await Instance.create({
        ...data,
        ...tempConfig,
        UserId: userId,
      });
      let from = path.join(
        __dirname,
        "../../public/templates/",
        template.name.toLowerCase()
      );
      let to = path.join(__dirname, "../../public/instances/", newInstance.id);
      await copyFolder(from, to);
      await Template.update(
        { used: template.used + 1 },
        { where: { id: templateId } }
      );
      resolve(newInstance);
    } catch (error) {
      reject(error);
    }
  });
};

export const getInstanceById = (
  id: string,
  fields?: string[] | []
): Promise<InstanceType> => {
  return new Promise(async (resolve, reject) => {
    try {
      let instance: InstanceType = await Instance.findOne(
        {
          where: { [Op.or]: { id, subdomain: id } },
          include: {
            model: User,
            attributes: ["id", "name", "profileImage"],
          },
          attributes: fields,
        },
        { raw: true }
      );
      if (!instance)
        return reject({ status: 404, message: "No Instance Found" });
      resolve(instance);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllInstances = (id?: string): Promise<InstanceType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = id
        ? {
            attributes: [
              "id",
              "name",
              "description",
              "keywords",
              "likes",
              "shares",
            ],
            where: { userId: id, status: true },
          }
        : {
            include: {
              model: User,
              attributes: ["id", "name", "profileImage"],
            },
            attributes: [
              "id",
              "name",
              "description",
              "keywords",
              "likes",
              "shares",
            ],
            where: { status: true },
          };
      let instances: InstanceType[] = await Instance.findAll(query, {
        raw: true,
      });
      resolve(instances);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCode = (filepath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      let src = path.join(__dirname, "../../public/instances", filepath);
      if (!fs.existsSync(src))
        return reject({ status: 404, message: "Requested File Not Found" });
      fs.readFile(src, (err, data) => {
        if (err) return reject(err);
        resolve(data.toString());
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const updateInstance = (
  id: string,
  data: InstanceType
): Promise<InstanceType> => {
  return new Promise(async (resolve, reject) => {
    try {
      await Instance.update(data, { where: { id } });
      let updated = await getInstanceById(id, [
        "id",
        "name",
        "description",
        "keywords",
        "likes",
        "shares",
      ]);
      resolve(updated);
    } catch (error) {
      reject(error);
    }
  });
};

export const edited = (id: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await Instance.update({ lastEditied: Date.now() }, { where: { id } });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteInstance = (id: string, userId: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      let instance = await getInstanceById(id);
      if (instance.UserId !== userId)
        return reject({
          status: 403,
          message: "You Have No right to delete other's Instance",
        });
      await Instance.update(
        { deletedAt: Date.now(), status: false },
        { where: { id } }
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getDeletedInstances = (
  userId: string,
  id?: string
): Promise<InstanceType[]> => {
  return new Promise(async (resolve, reject) => {
    let subQuery = id ? { id } : {};
    try {
      let fromDate = new Date(new Date().setDate(new Date().getDate() - 3));
      let toDate = new Date(new Date().setHours(24, 0, 0, 0));
      let instances: InstanceType[] = await Instance.findAll(
        {
          where: {
            deletedAt: { [Op.gte]: fromDate, [Op.lte]: toDate },
            status: false,
            UserId: userId,
            ...subQuery,
          },
          attributes: [
            "id",
            "name",
            "description",
            "keywords",
            "likes",
            "views",
            "shares",
          ],
        },
        { raw: true }
      );
      resolve(instances);
    } catch (error) {
      reject(error);
    }
  });
};

export const retriveInstance = (
  id: string,
  userId: string
): Promise<InstanceType> => {
  return new Promise(async (resolve, reject) => {
    try {
      let instance = await getDeletedInstances(userId, id);
      if (instance.length === 0)
        return reject({
          status: 404,
          message: "Your Instance Permantly Deleted",
        });
      await Instance.update(
        { deletedAt: null, status: true },
        { where: { id } }
      );
      let updatedInstance = await getInstanceById(id);
      resolve(updatedInstance);
    } catch (error) {
      reject(error);
    }
  });
};

const defaultExports = {
  createInstance,
  copyFolder,
  getInstanceById,
  getAllInstances,
  getCode,
  updateInstance,
  edited,
  deleteInstance,
  getDeletedInstances,
  retriveInstance,
};

export default defaultExports;
