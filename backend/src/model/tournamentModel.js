import { DataTypes } from "sequelize";

const createTournamentModel = (sequelize) => {
  const Tournament = sequelize.define(
    "Tournament",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      arenaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      entryFee: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      prizePool: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      maxTeams: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("upcoming", "ongoing", "completed", "cancelled"),
        defaultValue: "upcoming",
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "tournaments",
      timestamps: true,
    }
  );
  return Tournament;
};

export default createTournamentModel;
