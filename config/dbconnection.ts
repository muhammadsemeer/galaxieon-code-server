import { Sequelize, DataTypes } from "sequelize";
import { dbConfig } from "../constants/db";
import { readdirSync } from "fs";
import { join } from "path";

const sequelize: Sequelize = new Sequelize({
  ...dbConfig,
  dialect: "mariadb",
});

const db: any = {};
const models = join(__dirname, "../", "models"); // path to a models' folder

readdirSync(models)
  .filter(function (file) {
    return file.indexOf(".") !== 0 && file.slice(-3) === ".ts";
  })
  .forEach(function (file) {
    const model = require(join(__dirname, "../models", file))(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
