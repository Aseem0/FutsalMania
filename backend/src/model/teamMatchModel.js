import { DataTypes } from "sequelize";

const createTeamMatchModel = (sequelize) => {
  const TeamMatch = sequelize.define(
    "TeamMatch",
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
      status: {
        type: DataTypes.ENUM("open", "scheduled", "completed", "cancelled"),
        defaultValue: "open",
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      hostTeamId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      customTeamName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hostId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      guestTeamId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      guestId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      guestCustomTeamName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      guestContactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      arenaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Not Provided",
      },
    },
    {
      tableName: "team_matches",
      timestamps: true,
    }
  );
  return TeamMatch;
};

export default createTeamMatchModel;
