import { DataTypes } from "sequelize";

const createAnnouncementModel = (sequelize) => {
  const Announcement = sequelize.define(
    "Announcement",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      arenaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "arenas",
          key: "id",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "announcements",
      timestamps: false,
    }
  );
  return Announcement;
};

export default createAnnouncementModel;
