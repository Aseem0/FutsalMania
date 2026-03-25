import { User, sequelize } from "./src/model/index.js";
import dotenv from "dotenv";

dotenv.config();

const checkAdmin = async () => {
  try {
    const user = await User.findOne({ where: { username: "Ram" } });
    if (user) {
      console.log("Found user 'Ram':", {
        id: user.id,
        username: user.username,
        role: user.role,
        hasPassword: !!user.password,
      });
    } else {
      console.log("User 'Ram' NOT found in database.");
    }
  } catch (error) {
    console.error("Error checking user:", error);
  } finally {
    await sequelize.close();
  }
};

checkAdmin();
