import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

async function checkTables() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    const [results] = await sequelize.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    console.log('Tables:', results.map(r => r.tablename));
  } catch (err) {
    console.error('Connection error:', err.message);
  } finally {
    await sequelize.close();
  }
}

checkTables();
