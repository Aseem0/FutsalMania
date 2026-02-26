import { Sequelize } from "sequelize";
import createUserModel from "./userModel.js";
import createArenaModel from "./arenaModel.js";
import createMatchModel from "./matchModel.js";
import createTeamModel from "./teamModel.js";
import createTeamMatchModel from "./teamMatchModel.js";
import createPlayerRecruitmentModel from "./playerRecruitmentModel.js";
import createRecruitmentApplicationModel from "./recruitmentApplicationModel.js";
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
const Team = createTeamModel(sequelize);
const TeamMatch = createTeamMatchModel(sequelize);
const PlayerRecruitment = createPlayerRecruitmentModel(sequelize);
const RecruitmentApplication = createRecruitmentApplicationModel(sequelize);

// Set up associations
User.hasMany(Match, { foreignKey: "hostId", as: "hostedMatches" });
Match.belongsTo(User, { foreignKey: "hostId", as: "host" });

Arena.hasMany(Match, { foreignKey: "arenaId" });
Match.belongsTo(Arena, { foreignKey: "arenaId", as: "arena" });

// Many-to-Many for Players joining matches
User.belongsToMany(Match, { through: "MatchPlayers", as: "playingMatches", foreignKey: "userId" });
Match.belongsToMany(User, { through: "MatchPlayers", as: "players", foreignKey: "matchId" });

// --- Teams & Team Matches ---

// Team Owner
User.hasMany(Team, { foreignKey: "ownerId", as: "ownedTeams" });
Team.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// Team Members (Many-to-Many)
User.belongsToMany(Team, { through: "TeamMembers", as: "memberTeams", foreignKey: "userId" });
Team.belongsToMany(User, { through: "TeamMembers", as: "members", foreignKey: "teamId" });

// Team Match Associations
Team.hasMany(TeamMatch, { foreignKey: "hostTeamId", as: "hostedTeamMatches" });
TeamMatch.belongsTo(Team, { foreignKey: "hostTeamId", as: "hostTeam" });

Team.hasMany(TeamMatch, { foreignKey: "guestTeamId", as: "guestTeamMatches" });
TeamMatch.belongsTo(Team, { foreignKey: "guestTeamId", as: "guestTeam" });

Arena.hasMany(TeamMatch, { foreignKey: "arenaId" });
TeamMatch.belongsTo(Arena, { foreignKey: "arenaId", as: "arena" });

// --- Player Recruitment Associations ---
User.hasMany(PlayerRecruitment, { foreignKey: "hostId", as: "hostedRecruitments" });
PlayerRecruitment.belongsTo(User, { foreignKey: "hostId", as: "host" });

Team.hasMany(PlayerRecruitment, { foreignKey: "teamId", as: "teamRecruitments" });
PlayerRecruitment.belongsTo(Team, { foreignKey: "teamId", as: "team" });

// Recruitment Application Associations
User.hasMany(RecruitmentApplication, { foreignKey: "userId", as: "applications" });
RecruitmentApplication.belongsTo(User, { foreignKey: "userId", as: "applicant" });

PlayerRecruitment.hasMany(RecruitmentApplication, { foreignKey: "recruitmentId", as: "applications" });
RecruitmentApplication.belongsTo(PlayerRecruitment, { foreignKey: "recruitmentId", as: "recruitment" });

export { sequelize, User, Arena, Match, Team, TeamMatch, PlayerRecruitment, RecruitmentApplication };
export default { sequelize, User, Arena, Match, Team, TeamMatch, PlayerRecruitment, RecruitmentApplication };
