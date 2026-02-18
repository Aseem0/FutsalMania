import { Sequelize } from "sequelize";
import createUserModel from "./userModel.js";
import createArenaModel from "./arenaModel.js";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "postgres",
    logging: false, // Set to console.log to see SQL queries
  }
);

// Initialize models
const User = createUserModel(sequelize);
const Arena = createArenaModel(sequelize);

// Set up associations here if needed in the future
// Example: User.hasMany(Arena);

export { sequelize, User, Arena };
export default { sequelize, User, Arena };
