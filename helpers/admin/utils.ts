import sequelize from "sequelize";
import Instance from "../../models/Instance";
import Template from "../../models/Template";
import User from "../../models/User";

export const getStats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [{ users }] = await User.findAll({
        where: {
          status: "active",
        },
        attributes: [[sequelize.fn("COUNT", sequelize.col("*")), "users"]],
        raw: true,
      });
      const [{ instances }] = await Instance.findAll({
        where: {
          status: true,
        },
        attributes: [[sequelize.fn("COUNT", sequelize.col("*")), "instances"]],
        raw: true,
      });
      const [{ templates }] = await Template.findAll({
        where: {
          status: true,
        },
        attributes: [[sequelize.fn("COUNT", sequelize.col("*")), "templates"]],
        raw: true,
      });
      resolve([
        { title: "Users", value: users },
        { title: "Instances", value: instances },
        { title: "Templates", value: templates },
      ]);
    } catch (e) {
      reject(e);
    }
  });
};
