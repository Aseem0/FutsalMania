import { DataTypes } from "sequelize";

const createManagerModel = (sequelize) => {
  const Manager = sequelize.define(
    "Manager",
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
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "manager",
      },
      arenaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "arenas",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("active", "disabled"),
        allowNull: false,
        defaultValue: "active",
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Managers created by Admin are verified by default
      },
    },
    {
      tableName: "managers",
      timestamps: true,
    }
  );
  return Manager;
};

export default createManagerModel;
