import { Sequelize, UUIDV4, ModelCtor, Model } from "sequelize";

export = (sequelize: Sequelize, DataTypes: any): ModelCtor<Model<any, any>> => {
  const User: ModelCtor<Model<any, any>> | any = sequelize.define("User", {
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
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  User.associate = ({ Instance }: any) => {
    User.hasMany(Instance);
  };

  return User;
};
