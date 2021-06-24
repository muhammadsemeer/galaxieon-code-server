import { DataTypes, UUIDV4, ModelCtor, Model } from "sequelize";
import db from "../config/dbconnection";
import User from "./User";

const Instance: ModelCtor<Model<any, any>> | any = db.define("Instance", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  subdomain: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  keywords: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isPriavte: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fork: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  files: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  autosave: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  autopreview: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  shares: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  forks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  deletedAt: {
    type: DataTypes.DATE,
    defaultValue: null,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
User.hasMany(Instance);
Instance.belongsTo(User);

export default Instance;
