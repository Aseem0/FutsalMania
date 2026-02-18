import { DataTypes } from "sequelize";

const createArenaModel = (sequelize) => {
  const Arena = sequelize.define(
    "Arena",
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
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      distance: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "arenas",
      timestamps: false,
    }
  );
  return Arena;
};

export default createArenaModel;
