import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Robust Path-Agnostic Environment Loading
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import { dbConnection } from "./db/dbconnection.js";
import { seedArenas, seedAdmin } from "./db/seeders.js";
import router from "./routes/routes.js";

const app = express();

app.use(
  cors({
    origin: "*", // Allow all origins for local development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Startup Health Check
  if (!process.env.JWT_SECRET) {
    console.error("❌ CRITICAL: JWT_SECRET is not defined in .env file!");
    process.exit(1);
  } else {
    console.log("✅ Configuration Initialized: JWT_SECRET is active.");
  }

  await dbConnection();
  await seedArenas();
  await seedAdmin();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
