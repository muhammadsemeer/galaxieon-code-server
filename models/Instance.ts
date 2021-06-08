import { Sequelize, UUIDV4, ModelCtor, Model } from "sequelize";
import db from "../config/dbconnection";

export = (sequelize: Sequelize, DataTypes: any): ModelCtor<Model<any, any>> => {
  const Instance: ModelCtor<Model<any, any>> | any = sequelize.define(
    "Instance",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
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
        type: DataTypes.JSON,
        allowNull: true,
      },
      isPriavte: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
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
        defaultValue: false,
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
    }
  );

  Instance.associate = ({ User }: any) => {
    Instance.belongsTo(User);
  };

  return Instance;
};

// console.log(db.User)
