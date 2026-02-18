import { DataTypes } from "sequelize";

const createMatchModel = (sequelize) => {
  const Match = sequelize.define(
    "Match",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      format: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "5v5",
      },
      maxPlayers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      currentPlayers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // The host is the first player
      },
      skillLevel: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Intermediate",
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("open", "full", "completed", "cancelled"),
        defaultValue: "open",
      },
    },
    {
      tableName: "matches",
      timestamps: true,
    }
  );
  return Match;
};

export default createMatchModel;
