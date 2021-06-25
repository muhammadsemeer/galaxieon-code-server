import { Sequelize } from "sequelize";
import { dbConfig } from "../constants/db";

const sequelize: Sequelize = new Sequelize({
  ...dbConfig,
  dialect: "mariadb",
  dialectOptions: { autoJsonMap: false },
  logging: process.env.NODE_ENV === "development" ? true : false,
});

export default sequelize;
