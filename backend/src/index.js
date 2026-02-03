import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./db/dbconnection.js";
import router from "./routes/routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 5000;

dbConnection(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
