import { Sequelize } from "sequelize";
import createUserModel from "./userModel.js";
import createManagerModel from "./managerModel.js";
import createArenaModel from "./arenaModel.js";
import createMatchModel from "./matchModel.js";
import createTeamModel from "./teamModel.js";
import createTeamMatchModel from "./teamMatchModel.js";
import createPlayerRecruitmentModel from "./playerRecruitmentModel.js";
import createRecruitmentApplicationModel from "./recruitmentApplicationModel.js";
import createTournamentModel from "./tournamentModel.js";
import createBookingModel from "./bookingModel.js";
import createScheduleModel from "./scheduleModel.js";
import createAnnouncementModel from "./announcementModel.js";
import createNotificationModel from "./notificationModel.js";
import createTournamentRegistrationModel from "./tournamentRegistrationModel.js";
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
const Manager = createManagerModel(sequelize);
const Arena = createArenaModel(sequelize);
const Match = createMatchModel(sequelize);
const Team = createTeamModel(sequelize);
const TeamMatch = createTeamMatchModel(sequelize);
const PlayerRecruitment = createPlayerRecruitmentModel(sequelize);
const RecruitmentApplication = createRecruitmentApplicationModel(sequelize);
const Tournament = createTournamentModel(sequelize);
const Booking = createBookingModel(sequelize);
const Schedule = createScheduleModel(sequelize);
const Announcement = createAnnouncementModel(sequelize);
const Notification = createNotificationModel(sequelize);
const TournamentRegistration = createTournamentRegistrationModel(sequelize);

// Set up associations
User.hasMany(Match, { foreignKey: "hostId", as: "hostedMatches" });
Match.belongsTo(User, { foreignKey: "hostId", as: "host" });

Arena.hasMany(Match, { foreignKey: "arenaId" });
Match.belongsTo(Arena, { foreignKey: "arenaId", as: "arena" });

Arena.hasMany(Manager, { foreignKey: "arenaId", as: "managers" });
Manager.belongsTo(Arena, { foreignKey: "arenaId", as: "arena" });

// --- Bookings & Schedules ---
Arena.hasMany(Booking, { foreignKey: "arenaId", as: "bookings" });
Booking.belongsTo(Arena, { foreignKey: "arenaId", as: "arena" });

User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

Arena.hasMany(Schedule, { foreignKey: "arenaId", as: "schedules" });
Schedule.belongsTo(Arena, { foreignKey: "arenaId", as: "arena" });

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

TeamMatch.belongsTo(User, { foreignKey: "guestId", as: "guest" });
User.hasMany(TeamMatch, { foreignKey: "guestId", as: "joinedTeamMatches" });

Arena.hasMany(TeamMatch, { foreignKey: "arenaId" });
TeamMatch.belongsTo(Arena, { foreignKey: "arenaId", as: "arena" });

User.hasMany(TeamMatch, { foreignKey: "hostId", as: "organizedTeamMatches" });
TeamMatch.belongsTo(User, { foreignKey: "hostId", as: "host" });

// --- Player Recruitment Associations ---
User.hasMany(PlayerRecruitment, { foreignKey: "hostId", as: "hostedRecruitments" });
PlayerRecruitment.belongsTo(User, { foreignKey: "hostId", as: "host" });

Team.hasMany(PlayerRecruitment, { foreignKey: "teamId", as: "teamRecruitments" });
PlayerRecruitment.belongsTo(Team, { foreignKey: "teamId", as: "team" });

// --- Tournament Associations ---
Arena.hasMany(Tournament, { foreignKey: "arenaId", as: "tournaments" });
Tournament.belongsTo(Arena, { foreignKey: "arenaId", as: "arena" });

// Tournament Registration Associations
Tournament.hasMany(TournamentRegistration, { foreignKey: "tournamentId", as: "registrations" });
TournamentRegistration.belongsTo(Tournament, { foreignKey: "tournamentId", as: "tournament" });

User.hasMany(TournamentRegistration, { foreignKey: "userId", as: "tournamentRegistrations" });
TournamentRegistration.belongsTo(User, { foreignKey: "userId", as: "user" });

// Recruitment Application Associations
User.hasMany(RecruitmentApplication, { foreignKey: "userId", as: "applications" });
RecruitmentApplication.belongsTo(User, { foreignKey: "userId", as: "applicant" });

PlayerRecruitment.hasMany(RecruitmentApplication, { foreignKey: "recruitmentId", as: "applications", onDelete: 'CASCADE' });
RecruitmentApplication.belongsTo(PlayerRecruitment, { foreignKey: "recruitmentId", as: "recruitment" });

// --- Announcement Associations ---
User.hasMany(Announcement, { foreignKey: "authorId", as: "announcements" });
Announcement.belongsTo(User, { foreignKey: "authorId", as: "author" });

Arena.hasMany(Announcement, { foreignKey: "arenaId", as: "announcements" });
Announcement.belongsTo(Arena, { foreignKey: "arenaId", as: "arena" });

// --- Notification Associations ---
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

// --- Match-Booking Association ---
Match.hasOne(Booking, { foreignKey: "matchId", as: "booking", onDelete: 'CASCADE' });
Booking.belongsTo(Match, { foreignKey: "matchId", as: "match" });

TeamMatch.hasOne(Booking, { foreignKey: "teamMatchId", as: "booking", onDelete: 'CASCADE' });
Booking.belongsTo(TeamMatch, { foreignKey: "teamMatchId", as: "teamMatch" });

export { sequelize, User, Manager, Arena, Match, Team, TeamMatch, PlayerRecruitment, RecruitmentApplication, Tournament, TournamentRegistration, Booking, Schedule, Announcement, Notification };
export default { sequelize, User, Manager, Arena, Match, Team, TeamMatch, PlayerRecruitment, RecruitmentApplication, Tournament, TournamentRegistration, Booking, Schedule, Announcement, Notification };
