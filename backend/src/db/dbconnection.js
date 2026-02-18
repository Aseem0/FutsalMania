import { sequelize } from "../model/index.js";

/**
 * Authenticates and establishes the database connection.
 */
export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
    
    // Sync models
    await sequelize.sync({ force: false });
    console.log("✅ Models synced with database.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); // Exit if connection fails
  }
};
