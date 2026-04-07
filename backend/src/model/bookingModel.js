import { DataTypes } from "sequelize";

const createBookingModel = (sequelize) => {
  const Booking = sequelize.define(
    "Booking",
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
      startTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
        defaultValue: "pending",
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "bookings",
      timestamps: true,
    }
  );
  return Booking;
};

export default createBookingModel;
