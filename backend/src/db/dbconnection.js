import { sequelize } from "../model/index.js";


export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    
    try {
      await sequelize.query(`ALTER TABLE team_matches ALTER COLUMN "hostTeamId" DROP NOT NULL;`);
      console.log("✅ hostTeamId constraint updated (nullable).");
    } catch (e) {
      
      console.log("ℹ️  hostTeamId migration skipped (table may not exist yet).");
    }

    // Sync models
    await sequelize.sync({ alter: true });
    console.log("✅ Models synced with database.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); 
  }
}
