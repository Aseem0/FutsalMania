import { generateAccessToken, generateRefreshToken } from "../../auth/auth.js";
import { User, Manager, Arena } from "../model/index.js";
import bcryptjs from "bcryptjs";
import { Op } from "sequelize";
import { generateOTP, hashOTP, sendOTPEmail } from "../utils/emailService.js";

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

    // Generate and handle OTP
    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await User.create({
      username,
      email,
      password: hashedPassword,
      refreshToken,
      is_verified: false,
      otp_code: hashedOtp,
      otp_expiry: otpExpiry,
      last_otp_sent: new Date(),
    });

    // Send the plain text OTP to user's email
    try {
      await sendOTPEmail(email, otp);
      console.log(`[Signup] OTP email sent successfully to ${email}`);
    } catch (mailError) {
      console.error("[Signup] Failed to send OTP email:", mailError);
      console.log(`[DEBUG] OTP for ${email} is: ${otp}`);
      return res.status(201).json({
        message: "User registered, but verification email failed to send. Check server logs for OTP.",
        userData: { username, email },
        debugOtp: otp // Temporarily include in response for easier testing if needed, or just log to console
      });
    }

    return res.status(201).json({
      message: "User registered. OTP sent to your email. Please verify.",
      userData: { username, email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const loginController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username/email and password are required." });
  }

  try {
    let existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      } 
    });

    // If not found in User table, check Manager table
    let isManager = false;
    if (!existingUser) {
      existingUser = await Manager.findOne({
        where: {
          [Op.or]: [
            { username: username },
            { email: username }
          ]
        }
      });
      if (existingUser) isManager = true;
    }

    if (existingUser != null) {
      if (existingUser.status === 'disabled') {
        console.log(`[Login] Access denied: Account ${username} is disabled.`);
        return res.status(403).json({ message: "Your account has been disabled. Please contact an administrator." });
      }

      // Check verification status (only for regular users)
      if (!isManager && !existingUser.is_verified) {
        console.log(`[Login] Rejected: User ${username} is not verified.`);
        return res.status(401).json({ message: "Account not verified. Please verify your email first." });
      }

      const isValidPassword = await bcryptjs.compare(
        password,
        existingUser.password
      );
      
      if (!isValidPassword) {
        return res.status(401).json("Invalid password");
      }

      // Prepare payload for token
      const tokenPayload = {
        id: existingUser.id,
        username: existingUser.username,
        role: existingUser.role,
        arenaId: isManager ? existingUser.arenaId : null
      };

      const accessToken = await generateAccessToken(tokenPayload);
      const refreshToken = await generateRefreshToken(tokenPayload);

      await existingUser.update({ refreshToken: refreshToken });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return res.status(200).json({
        message: "Login successful",
        userData: {
          username: existingUser.username,
          role: existingUser.role,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } else {
      return res.status(404).json("Account not found");
    }
  } catch (error) {
    console.log("Internal error", error);
    res.status(500).json("Internal server error");
  }
};

export const verifyOTPController = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Check for lockout
    if (user.otp_attempts >= 5) {
      return res.status(429).json({ message: "Too many failed attempts. Please request a new OTP." });
    }

    // Check expiry
    if (new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Compare hashed OTP
    const isMatch = await bcryptjs.compare(otp, user.otp_code);
    if (!isMatch) {
      // Increment attempts
      user.otp_attempts += 1;
      await user.save();
      
      const remainingAttempts = 5 - user.otp_attempts;
      return res.status(400).json({ 
        message: `Invalid OTP code. ${remainingAttempts} attempts remaining.`,
        attemptsRemaining: remainingAttempts
      });
    }

    // Mark as verified
    user.is_verified = true;
    user.otp_code = null;
    user.otp_expiry = null;
    user.otp_attempts = 0; // Reset attempts
    await user.save();

    return res.status(200).json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error("OTP Verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOTPController = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Rate Limiting: Check cooldown (60 seconds)
    const now = new Date();
    if (user.last_otp_sent && (now - new Date(user.last_otp_sent)) < 60000) {
      const waitTime = Math.ceil(60 - (now - new Date(user.last_otp_sent)) / 1000);
      return res.status(429).json({ message: `Please wait ${waitTime} seconds before requesting another code.` });
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // Update user
    user.otp_code = hashedOtp;
    user.otp_expiry = otpExpiry;
    user.otp_attempts = 0; // Reset attempts on resend
    user.last_otp_sent = now;
    await user.save();

    // Send email
    try {
      await sendOTPEmail(email, otp);
      console.log(`[Resend OTP] email sent successfully to ${email}`);
    } catch (mailError) {
      console.error("[Resend OTP] Failed to send email:", mailError);
      console.log(`[DEBUG] New OTP for ${email} is: ${otp}`);
      return res.status(200).json({ 
        message: "New OTP generated, but email failed to send. Check server logs for the code.",
        debugOtp: otp 
      });
    }

    return res.status(200).json({ message: "New OTP sent to your email." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ message: "Internal server error" });
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
    console.log(`[API] Fetching Profile for user: ${userId}`);
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
    
    // Check in both tables for duplicates
    if (role.toLowerCase() === 'manager') {
      const existingInManager = await Manager.findOne({ where: { [Op.or]: [{ username }, { email }] } });
      if (existingInManager) return res.status(409).json({ message: "Username or Email already exists in Managers" });
    }

    let newUser;
    if (role.toLowerCase() === 'manager') {
      newUser = await Manager.create({
        username,
        email,
        password: hashedPassword,
        role: "manager",
        is_verified: true,
      });
    } else {
      newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role.toLowerCase(),
        is_verified: true,
      });
    }

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

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate reset OTP
    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp_code = hashedOtp;
    user.otp_expiry = otpExpiry;
    user.otp_attempts = 0;
    user.last_otp_sent = new Date();
    await user.save();

    // Send email
    try {
      await sendOTPEmail(email, otp);
      console.log(`[Forgot Password] OTP email sent to ${email}`);
    } catch (mailError) {
      console.error("[Forgot Password] Failed to send email:", mailError);
      console.log(`[DEBUG] Password Reset OTP for ${email} is: ${otp}`);
      return res.status(200).json({ 
        message: "Reset code generated, but email failed. Check logs.",
        debugOtp: otp 
      });
    }

    return res.status(200).json({ message: "Password reset code sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPasswordController = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check expiry
    if (new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    // Compare OTP
    const isMatch = await bcryptjs.compare(otp, user.otp_code);
    if (!isMatch) {
      user.otp_attempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid reset code" });
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 8);
    
    // Update user
    user.password = hashedPassword;
    user.otp_code = null;
    user.otp_expiry = null;
    user.otp_attempts = 0;
    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully. Please login with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
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
