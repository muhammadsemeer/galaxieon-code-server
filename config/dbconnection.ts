import { Sequelize } from "sequelize";
import { dbConfig } from "../constants/db";

const sequelize: Sequelize = new Sequelize({
  ...dbConfig,
  dialect: "mariadb",
  dialectOptions: { autoJsonMap: false },
  logging: process.env.NODE_ENV === "production" ? false : console.log,
});

export default sequelize;
