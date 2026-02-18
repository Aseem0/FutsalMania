import { generateAccessToken, generateRefreshToken } from "../../auth/auth.js";
import { User } from "../model/index.js";
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

export const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profilePicture, username, email } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      userData: {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const getProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "email", "profilePicture"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
