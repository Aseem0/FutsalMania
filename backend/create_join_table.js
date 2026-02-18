import { sequelize } from './src/model/index.js';

async function updateSchema() {
  try {
    console.log('Checking for MatchPlayers table...');
    
    // Create MatchPlayers table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "MatchPlayers" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES "users"("id") ON DELETE CASCADE,
        "matchId" INTEGER REFERENCES "matches"("id") ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        UNIQUE("userId", "matchId")
      );
    `);
    
    console.log('MatchPlayers table ensured.');
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    await sequelize.close();
  }
}

updateSchema();
