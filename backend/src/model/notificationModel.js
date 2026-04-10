import { DataTypes } from "sequelize";

const createNotificationModel = (sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      type: {
        type: DataTypes.ENUM(
          "match_join",
          "match_full",
          "game_reminder",
          "booking_confirmed",
          "booking_cancelled",
          "announcement",
          "recruitment_apply"
        ),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      relatedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "notifications",
      timestamps: true,
      updatedAt: false,
    }
  );
  return Notification;
};

export default createNotificationModel;
