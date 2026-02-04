import { generateAccessToken, generateRefreshToken } from "../../auth/auth.js";
import { User } from "../db/dbconnection.js";
import bcryptjs from "bcryptjs";

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcryptjs.hashSync(password, 8);
    const refreshToken = await generateRefreshToken({ username });

    await User.create({
      username,
      email,
      password: hashedPassword,
      refreshToken,
    });

    return res.status(201).json({
      message: "User registered successfully",
      userData: { username, email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginController = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser != null) {
      const isValidPassword = await bcryptjs.compareSync(
        password,
        existingUser.password
      );
      if (!isValidPassword) {
        return res.status(401).json("Invalid password");
      }
      //   console.log(existingUser.dataValues);
      const accessToken = await generateAccessToken(existingUser.dataValues);
      const refreshToken = await generateRefreshToken(existingUser.dataValues);

      existingUser.update({ refreshToken: refreshToken });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return res.status(200).json({
        message: "Login successful",
        userData: {
          username: existingUser.dataValues.username,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } else {
      return res.status(404).json("User not found");
    }
  } catch (error) {
    console.log("Internal error");
    res.status(500).json("Internal server error");
  }
};
