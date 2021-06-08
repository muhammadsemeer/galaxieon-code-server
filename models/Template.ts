import { Sequelize, UUIDV4, ModelCtor, Model } from "sequelize";

export = (sequelize: Sequelize, DataTypes: any): ModelCtor<Model<any, any>> => {
  const Template: ModelCtor<Model<any, any>> | any  = sequelize.define("Template", {
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
  return Template;
};
