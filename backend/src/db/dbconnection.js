import { sequelize } from "../model/index.js";


export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    
    try {
      await sequelize.query(`ALTER TABLE team_matches ALTER COLUMN "hostTeamId" DROP NOT NULL;`);
      console.log("✅ hostTeamId constraint updated (nullable).");
    } catch (e) {
      console.log("ℹ️  hostTeamId migration skipped.");
    }

    // Fix for enabling timestamps on existing users table
    try {
      await sequelize.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        ALTER TABLE users ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      `);
      console.log("✅ Timestamps initialized for existing users.");
    } catch (e) {
      console.log("ℹ️  Timestamp initialization skipped (may already exist).");
    }

    // Sync models
    await sequelize.sync({ alter: true });
    console.log("✅ Models synced with database.");

    // DATA MIGRATION: Move existing managers from 'users' table to 'managers' table
    try {
      // 1. Check if any managers are left in the users table
      const [managersToMove] = await sequelize.query(`SELECT * FROM users WHERE role = 'manager';`);
      
      if (managersToMove.length > 0) {
        console.log(`🚀 Found ${managersToMove.length} managers to migrate...`);
        
        // 2. We use a raw query because 'arenaId' might have been deleted from the User model but still exists in the DB or was just moved.
        // During sync {alter: true}, Sequelize might have dropped arenaId from users.
        // However, if we run this immediately after, we check if it works.
        
        for (const managerData of managersToMove) {
          await sequelize.query(`
            INSERT INTO managers (username, email, password, "refreshToken", "profilePicture", role, "arenaId", status, is_verified, "createdAt", "updatedAt")
            VALUES (?, ?, ?, ?, ?, 'manager', ?, ?, true, NOW(), NOW())
            ON CONFLICT (email) DO NOTHING;
          `, {
            replacements: [
              managerData.username,
              managerData.email,
              managerData.password,
              managerData.refreshToken || null,
              managerData.profilePicture || null,
              managerData.arenaId || null,
              managerData.status || 'active'
            ]
          });
        }
        
        // 3. Remove them from the users table now that they are in managers
        await sequelize.query(`DELETE FROM users WHERE role = 'manager';`);
        console.log("✅ Data migration: Managers moved to dedicated table.");
      }
    } catch (migrateError) {
      console.log("ℹ️  Manager migration skipped or already completed:", migrateError.message);
    }
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); 
  }
}
