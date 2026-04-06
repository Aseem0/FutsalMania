import { Router } from "express";
import {
  loginController,
  registerController,
  updateProfileController,
  getProfileController,
  getUsersCountController,
  getAllUsersController,
  adminCreateUserController,
  deleteUserController,
} from "../controller/userController.js";
import { getArenas, createArena, updateArena, deleteArena } from "../controller/arenaController.js";
import {
  createMatch,
  getMatches,
  getMyMatches,
  getMatchById,
  joinMatch,
  leaveMatch,
  deleteMatch,
} from "../controller/matchController.js";
import { createTeam, getMyTeams, getAllTeams } from "../controller/teamController.js";
import { hostTeamMatch, getTeamMatches, getTeamMatchById, joinAsOpponent } from "../controller/teamMatchController.js";
import { createRecruitment, getRecruitments } from "../controller/playerRecruitmentController.js";
import {
  applyToRecruitment,
  getMyApplications,
  getReceivedApplications,
} from "../controller/recruitmentApplicationController.js";
import {
  createTournament,
  getTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
} from "../controller/tournamentController.js";
import {
  createManager,
  getManagers,
  deleteManager,
  updateManager,
  updateManagerStatus,
  getManagerArena,
  getManagerBookings,
  updateManagerBooking,
  getManagerSchedule,
  updateManagerSlot,
  getManagerCustomers,
  getAllBookings,
} from "../controller/managerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const managerMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Manager role required." });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin role required." });
  }
};

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/arenas", getArenas);
router.post("/arenas", authMiddleware, adminMiddleware, createArena);
router.put("/arenas/:id", authMiddleware, adminMiddleware, updateArena);
router.delete("/arenas/:id", authMiddleware, adminMiddleware, deleteArena);

// User Routes
router.get("/users/profile", authMiddleware, getProfileController);
router.put("/users/profile", authMiddleware, updateProfileController);
router.get("/users/count", authMiddleware, getUsersCountController);
router.get("/users", authMiddleware, getAllUsersController);
router.post("/users/admin", authMiddleware, adminMiddleware, adminCreateUserController);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUserController);
router.get("/bookings", authMiddleware, adminMiddleware, getAllBookings);

// Match Routes (Individual)
router.post("/matches", authMiddleware, createMatch);
router.get("/matches", getMatches);
router.get("/matches/my", authMiddleware, getMyMatches);
router.get("/matches/:id", getMatchById);
router.post("/matches/:id/join", authMiddleware, joinMatch);
router.delete("/matches/:id/leave", authMiddleware, leaveMatch);
router.delete("/matches/:id", authMiddleware, deleteMatch);

// Team Routes
router.post("/teams", authMiddleware, createTeam);
router.get("/teams/my", authMiddleware, getMyTeams);
router.get("/teams", getAllTeams);

// Team Match Routes
router.post("/team-matches", authMiddleware, hostTeamMatch);
router.get("/team-matches", getTeamMatches);
router.get("/team-matches/:id", getTeamMatchById);
router.post("/team-matches/:matchId/join", authMiddleware, joinAsOpponent);

// Recruitment Routes
router.post("/recruitments", authMiddleware, createRecruitment);
router.get("/recruitments", getRecruitments);
router.post("/recruitments/:id/apply", authMiddleware, applyToRecruitment);
router.get("/recruitments/applications/my", authMiddleware, getMyApplications);
router.get("/recruitments/applications/received", authMiddleware, getReceivedApplications);

// Tournament Routes
router.post("/tournaments", authMiddleware, adminMiddleware, createTournament);
router.get("/tournaments", getTournaments);
router.get("/tournaments/:id", getTournamentById);
router.put("/tournaments/:id", authMiddleware, adminMiddleware, updateTournament);
router.delete("/tournaments/:id", authMiddleware, adminMiddleware, deleteTournament);

// Manager Management (Admin only)
router.post("/managers", authMiddleware, createManager);
router.get("/managers", authMiddleware, getManagers);
router.put("/managers/:id", authMiddleware, adminMiddleware, updateManager);
router.delete("/managers/:id", authMiddleware, deleteManager);
router.patch("/managers/:id", authMiddleware, updateManagerStatus);

// Manager Module Routes (Manager restricted)
router.get("/manager/arena", authMiddleware, managerMiddleware, getManagerArena);
router.get("/manager/bookings", authMiddleware, managerMiddleware, getManagerBookings);
router.patch("/manager/bookings/:id", authMiddleware, managerMiddleware, updateManagerBooking);
router.get("/manager/schedule", authMiddleware, managerMiddleware, getManagerSchedule);
router.patch("/manager/schedule/:id", authMiddleware, managerMiddleware, updateManagerSlot);
router.get("/manager/customers", authMiddleware, managerMiddleware, getManagerCustomers);

export default router;
