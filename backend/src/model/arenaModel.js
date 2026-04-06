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
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      openingHours: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "06:00 AM – 10:00 PM",
      },
      infrastructure: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "Turf Pitch, LED Lighting, Changing Rooms, Parking",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
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
