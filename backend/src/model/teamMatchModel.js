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
        allowNull: false,
      },
      guestTeamId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      arenaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
