import { generateAccessToken, generateRefreshToken } from "../../auth/auth.js";
import { User, Arena } from "../model/index.js";
import bcryptjs from "bcryptjs";
import { Op } from "sequelize";

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

    const hashedPassword = await bcryptjs.hash(password, 8);
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
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      } 
    });

    if (existingUser != null) {
      if (existingUser.status === 'disabled') {
        return res.status(403).json({ message: "Your account has been disabled. Please contact an administrator." });
      }

      const isValidPassword = await bcryptjs.compare(
        password,
        existingUser.password
      );
      if (!isValidPassword) {
        return res.status(401).json("Invalid password");
      }
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
          role: existingUser.dataValues.role,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } else {
      return res.status(404).json("User not found");
    }
  } catch (error) {
    console.log("Internal error", error);
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

    // Update fields
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
      attributes: ["id", "username", "email", "profilePicture", "role"],
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

export const getUsersCountController = async (req, res) => {
  try {
    const count = await User.count();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Get users count error:", error);
    res.status(500).json({ message: "Failed to fetch users count" });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: 'user'
      },
      attributes: ["id", "username", "email", "role", "profilePicture"],
      order: [['id', 'DESC']]
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const adminCreateUserController = async (req, res) => {
  const { username, email, password, role } = req.body;
  
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);
    
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
    });

    return res.status(201).json({
      message: "User created successfully",
      userData: { 
        id: newUser.id,
        username: newUser.username, 
        email: newUser.email,
        role: newUser.role
      },
    });
  } catch (error) {
    console.error("Admin user creation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserController = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting other admins (manual check anyway)
    if (user.role === 'admin') {
      return res.status(403).json({ message: "Cannot delete an admin account" });
    }

    await user.destroy();
    
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};
