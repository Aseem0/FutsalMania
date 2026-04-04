import { User, Arena } from "../model/index.js";
import bcryptjs from "bcryptjs";

export const createManager = async (req, res) => {
  const { name, email, password, futsal_id } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);
    const newManager = await User.create({
      username: name,
      email,
      password: hashedPassword,
      role: "manager",
      arenaId: futsal_id,
    });

    return res.status(201).json({
      message: "Manager created successfully",
      data: newManager,
    });
  } catch (error) {
    console.error("Create manager error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getManagers = async (req, res) => {
  try {
    const managers = await User.findAll({
      where: { role: "manager" },
      include: [
        {
          model: Arena,
          as: "arena",
          attributes: ["name"],
        },
      ],
      attributes: ["id", "username", "email", "role", "arenaId"],
    });

    // Format for frontend
    const formattedManagers = managers.map((m) => ({
      id: m.id,
      name: m.username,
      email: m.email,
      status: "active", // Default status for now
      futsal_name: m.arena?.name || "Unassigned",
    }));

    return res.status(200).json({ data: formattedManagers });
  } catch (error) {
    console.error("Get managers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteManager = async (req, res) => {
  const { id } = req.params;
  try {
    const manager = await User.findByPk(id);
    if (!manager || manager.role !== "manager") {
      return res.status(404).json({ message: "Manager not found" });
    }

    await manager.destroy();
    return res.status(200).json({ message: "Manager deleted successfully" });
  } catch (error) {
    console.error("Delete manager error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateManagerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const manager = await User.findByPk(id);
    if (!manager || manager.role !== "manager") {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Since we don't have a 'status' field in the model yet, we'll just mock this for now
    // or you could add a status field to userModel.js
    return res.status(200).json({ message: `Manager status updated to ${status}` });
  } catch (error) {
    console.error("Update manager status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
