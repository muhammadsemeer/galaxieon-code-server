import { Sequelize, UUIDV4, ModelCtor, Model } from "sequelize";

export = (sequelize: Sequelize, DataTypes: any): ModelCtor<Model<any,any>> => {
  const User = sequelize.define("User", {
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
      allowNull: false,
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
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  return User;
};
