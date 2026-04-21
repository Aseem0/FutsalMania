import { DataTypes } from "sequelize";

const createTournamentRegistrationModel = (sequelize) => {
  const TournamentRegistration = sequelize.define(
    "TournamentRegistration",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tournamentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tournaments",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      playersList: {
        type: DataTypes.TEXT,
        allowNull: true,
        helpText: "Comma-separated list of player names",
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
        defaultValue: "pending",
      },
    },
    {
      tableName: "tournament_registrations",
      timestamps: true,
    }
  );
  return TournamentRegistration;
};

export default createTournamentRegistrationModel;
