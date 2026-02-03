import { Sequelize } from "sequelize";
import createUserModel from "../model/userModel.js";
let User = null;

export const dbConnection = async (database, username, password) => {
  const sequelize = new Sequelize(database, username, password, {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "postgres",
  });
  try {
    await sequelize.authenticate();
    User = await createUserModel(sequelize);
    await sequelize.sync({ force: false });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { User };
