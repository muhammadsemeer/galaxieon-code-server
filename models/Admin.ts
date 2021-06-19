import { timeStamp } from "console";
import { DataTypes, ModelCtor, Model } from "sequelize";
import db from "../config/dbconnection";

const Admin: ModelCtor<Model<any, any>> | any = db.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Admin;
