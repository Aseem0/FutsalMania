import { Arena, sequelize } from "./src/model/index.js";
import dotenv from "dotenv";

dotenv.config();

const checkArenas = async () => {
  try {
    const arenas = await Arena.findAll();
    console.log(`Found ${arenas.length} arenas:`);
    arenas.forEach(a => {
      console.log(`- ${a.name} (ID: ${a.id})`);
    });
  } catch (error) {
    console.error("Error checking arenas:", error);
  } finally {
    await sequelize.close();
  }
};

checkArenas();
