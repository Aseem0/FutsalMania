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
} from "../controller/matchController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/arenas", getArenas);

// User Routes
router.get("/users/profile", authMiddleware, getProfileController);
router.put("/users/profile", authMiddleware, updateProfileController);

// Match Routes
router.post("/matches", authMiddleware, createMatch);
router.get("/matches", getMatches);
router.get("/matches/my", authMiddleware, getMyMatches);
router.get("/matches/:id", getMatchById);
router.post("/matches/:id/join", authMiddleware, joinMatch);

export default router;
