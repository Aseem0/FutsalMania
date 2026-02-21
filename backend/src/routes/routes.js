import { Router } from "express";
import {
  loginController,
  registerController,
  updateProfileController,
  getProfileController,
} from "../controller/userController.js";
import { getArenas } from "../controller/arenaController.js";
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
import { hostTeamMatch, getTeamMatches, joinAsOpponent } from "../controller/teamMatchController.js";
import { createRecruitment, getRecruitments } from "../controller/playerRecruitmentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/arenas", getArenas);

// User Routes
router.get("/users/profile", authMiddleware, getProfileController);
router.put("/users/profile", authMiddleware, updateProfileController);

// Match Routes (Individual)
router.post("/matches", authMiddleware, createMatch);
router.get("/matches", getMatches);
router.get("/matches/my", authMiddleware, getMyMatches);
router.get("/matches/:id", getMatchById);
router.post("/matches/:id/join", authMiddleware, joinMatch);
router.delete("/matches/:id/leave", authMiddleware, leaveMatch);
router.delete("/matches/:id", authMiddleware, deleteMatch);

// Team Routes
router.get("/teams/my", authMiddleware, getMyTeams);
router.get("/teams", getAllTeams);

// Team Match Routes
router.post("/team-matches", authMiddleware, hostTeamMatch);
router.get("/team-matches", getTeamMatches);
router.post("/team-matches/:matchId/join", authMiddleware, joinAsOpponent);

// Recruitment Routes
router.post("/recruitments", authMiddleware, createRecruitment);
router.get("/recruitments", getRecruitments);

export default router;
