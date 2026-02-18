import { Router } from "express";
import {
  loginController,
  registerController,
} from "../controller/userController.js";
import { getArenas } from "../controller/arenaController.js";
import { createMatch, getMatches, getMyMatches } from "../controller/matchController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/arenas", getArenas);

// Match Routes
router.post("/matches", authMiddleware, createMatch);
router.get("/matches", getMatches);
router.get("/matches/my", authMiddleware, getMyMatches);

export default router;
