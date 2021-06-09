import { Sequelize } from "sequelize";
import { dbConfig } from "../constants/db";

const sequelize: Sequelize = new Sequelize({
  ...dbConfig,
  dialect: "mariadb",
});

export default sequelize;
