import { DataTypes } from "sequelize";

const createRecruitmentApplicationModel = (sequelize) => {
  const RecruitmentApplication = sequelize.define(
    "RecruitmentApplication",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recruitmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "recruitment_applications",
      timestamps: true,
    }
  );
  return RecruitmentApplication;
};

export default createRecruitmentApplicationModel;
