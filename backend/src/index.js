import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./db/dbconnection.js";
import { seedArenas } from "./db/seeders.js";
import router from "./routes/routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 5000;

// Startup Sequence
const startServer = async () => {
  await dbConnection();
  await seedArenas();
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();
