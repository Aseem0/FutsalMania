import { Router } from "express";
import {
  loginController,
  registerController,
} from "../controller/userController.js";
import { getArenas } from "../controller/arenaController.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/arenas", getArenas);

export default router;
