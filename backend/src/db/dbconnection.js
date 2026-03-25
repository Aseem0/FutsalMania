import { sequelize } from "../model/index.js";

/**
 * Authenticates and establishes the database connection.
 */
export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Fix: Drop NOT NULL constraint on hostTeamId so organizer-only matches work
    try {
      await sequelize.query(`ALTER TABLE team_matches ALTER COLUMN "hostTeamId" DROP NOT NULL;`);
      console.log("✅ hostTeamId constraint updated (nullable).");
    } catch (e) {
      // Table might not exist yet on first run, that's fine
      console.log("ℹ️  hostTeamId migration skipped (table may not exist yet).");
    }

    // Sync models
    await sequelize.sync({ alter: true });
    console.log("✅ Models synced with database.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); // Exit if connection fails
  }
};
