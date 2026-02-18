import { Sequelize } from "sequelize";
import createUserModel from "./userModel.js";
import createArenaModel from "./arenaModel.js";
import createMatchModel from "./matchModel.js";
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
const Match = createMatchModel(sequelize);

// Set up associations
User.hasMany(Match, { foreignKey: "hostId", as: "hostedMatches" });
Match.belongsTo(User, { foreignKey: "hostId", as: "host" });

Arena.hasMany(Match, { foreignKey: "arenaId" });
Match.belongsTo(Arena, { foreignKey: "arenaId", as: "arena" });

// Many-to-Many for Players joining matches
User.belongsToMany(Match, { through: "MatchPlayers", as: "playingMatches", foreignKey: "userId" });
Match.belongsToMany(User, { through: "MatchPlayers", as: "players", foreignKey: "matchId" });

export { sequelize, User, Arena, Match };
export default { sequelize, User, Arena, Match };
