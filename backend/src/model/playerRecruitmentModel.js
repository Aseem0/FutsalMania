import { DataTypes } from "sequelize";

const createPlayerRecruitmentModel = (sequelize) => {
  const PlayerRecruitment = sequelize.define(
    "PlayerRecruitment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      playersNeeded: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("open", "filled", "cancelled"),
        defaultValue: "open",
      },
      hostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "player_recruitments",
      timestamps: true,
    }
  );
  return PlayerRecruitment;
};

export default createPlayerRecruitmentModel;
