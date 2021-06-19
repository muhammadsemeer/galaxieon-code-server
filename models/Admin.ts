import { DataTypes, UUIDV4, ModelCtor, Model } from "sequelize";
import db from "../config/dbconnection";

const Admin: ModelCtor<Model<any, any>> | any = db.define("Admin", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Admin;
