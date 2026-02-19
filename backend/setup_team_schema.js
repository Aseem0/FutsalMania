import { sequelize } from './src/model/index.js';

async function setupTeamSchema() {
  try {
    console.log('Ensuring Team-related tables exist...');
    
    // 1. Teams Table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "teams" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL UNIQUE,
        "logo" TEXT,
        "description" TEXT,
        "ownerId" INTEGER REFERENCES "users"("id") ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);
    console.log('- teams table ensured.');

    // 2. TeamMembers (Join Table)
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "TeamMembers" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES "users"("id") ON DELETE CASCADE,
        "teamId" INTEGER REFERENCES "teams"("id") ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        UNIQUE("userId", "teamId")
      );
    `);
    console.log('- TeamMembers join table ensured.');

    // 3. TeamMatches Table
    await sequelize.query(`
      CREATE TYPE "enum_team_matches_status" AS ENUM ('open', 'scheduled', 'completed', 'cancelled');
    `).catch(() => console.log('Enum type for status already exists or failed.'));

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "team_matches" (
        "id" SERIAL PRIMARY KEY,
        "date" DATE NOT NULL,
        "time" VARCHAR(255) NOT NULL,
        "format" VARCHAR(255) DEFAULT '5v5',
        "status" "enum_team_matches_status" DEFAULT 'open',
        "price" FLOAT DEFAULT 0,
        "hostTeamId" INTEGER REFERENCES "teams"("id") ON DELETE CASCADE,
        "guestTeamId" INTEGER REFERENCES "teams"("id") ON DELETE SET NULL,
        "arenaId" INTEGER REFERENCES "arenas"("id") ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);
    console.log('- team_matches table ensured.');

    console.log('--- Team Schema Setup Complete ---');
  } catch (error) {
    console.error('Error setting up team schema:', error);
  } finally {
    await sequelize.close();
  }
}

setupTeamSchema();
