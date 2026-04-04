import { DataTypes } from "sequelize";

const createUserModel = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profilePicture: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("user", "admin", "manager"),
        allowNull: false,
        defaultValue: "user",
      },
      arenaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "arenas",
          key: "id",
        },
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
  return User;
};

export default createUserModel;
