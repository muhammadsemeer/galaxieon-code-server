import { DataTypes, UUIDV4, ModelCtor, Model } from "sequelize";
import db from "../config/dbconnection";

const Template: ModelCtor<Model<any, any>> | any = db.define("Template", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  files: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  used: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default Template;
