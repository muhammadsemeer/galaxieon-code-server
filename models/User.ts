import { UUIDV4, ModelCtor, Model, DataTypes } from "sequelize";
import db from "../config/dbconnection";

const User: ModelCtor<Model<any, any>> | any = db.define("User", {
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
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  following: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  authType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "active",
  },
});

export default User;
