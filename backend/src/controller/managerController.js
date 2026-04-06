import { User, Arena, Booking, Schedule } from "../model/index.js";
import bcryptjs from "bcryptjs";
import { Op } from "sequelize";

// --- Admin Operations for Managers ---

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
      attributes: ["id", "username", "email", "role", "arenaId", "status"],
    });

    const formattedManagers = managers.map((m) => ({
      id: m.id,
      name: m.username,
      email: m.email,
      status: m.status,
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

export const updateManager = async (req, res) => {
  const { id } = req.params;
  const { name, email, futsal_id } = req.body;
  try {
    const manager = await User.findByPk(id);
    if (!manager || manager.role !== "manager") {
      return res.status(404).json({ message: "Manager not found" });
    }

    if (email && email !== manager.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use by another account" });
      }
    }

    await manager.update({
      username: name || manager.username,
      email: email || manager.email,
      arenaId: futsal_id !== undefined ? futsal_id : manager.arenaId
    });

    return res.status(200).json({
      message: "Manager updated successfully",
      data: manager
    });
  } catch (error) {
    console.error("Update manager error:", error);
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

    await manager.update({ status });

    return res.status(200).json({ 
      message: `Manager status updated to ${status}`,
      data: manager
    });
  } catch (error) {
    console.error("Update manager status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { status, date } = req.query;

    const where = {};
    if (status) where.status = status;
    if (date) where.date = date;

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: User, as: "user", attributes: ["username", "email"] },
        { model: Arena, as: "arena", attributes: ["name"] }
      ],
      order: [["date", "DESC"], ["startTime", "ASC"]]
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Get all bookings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --- Manager Module Operations ---

export const getManagerArena = async (req, res) => {
  try {
    const arenaId = req.user.arenaId;
    if (!arenaId) return res.status(403).json({ message: "No arena assigned to this manager" });

    const arena = await Arena.findByPk(arenaId);
    if (!arena) return res.status(404).json({ message: "Arena not found" });

    // Quick stats
    const totalBookings = await Booking.count({ where: { arenaId } });
    const pendingBookings = await Booking.count({ where: { arenaId, status: "pending" } });
    
    // Revenue (completed/confirmed)
    const revenueResult = await Booking.sum("totalPrice", { 
      where: { 
        arenaId, 
        status: { [Op.in]: ["confirmed", "completed"] } 
      } 
    });

    return res.status(200).json({
      arena,
      stats: {
        totalBookings,
        pendingBookings,
        revenue: revenueResult || 0
      }
    });
  } catch (error) {
    console.error("Get manager arena error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getManagerBookings = async (req, res) => {
  try {
    const arenaId = req.user.arenaId;
    const { status, date } = req.query;

    const where = { arenaId };
    if (status) where.status = status;
    if (date) where.date = date;

    const bookings = await Booking.findAll({
      where,
      include: [{ model: User, as: "user", attributes: ["username", "email"] }],
      order: [["date", "DESC"], ["startTime", "ASC"]]
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Get manager bookings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateManagerBooking = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const arenaId = req.user.arenaId;
    const booking = await Booking.findOne({ where: { id, arenaId } });
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.update({ status });
    return res.status(200).json({ message: "Booking updated successfully", data: booking });
  } catch (error) {
    console.error("Update manager booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getManagerSchedule = async (req, res) => {
  try {
    const arenaId = req.user.arenaId;
    const schedule = await Schedule.findAll({
      where: { arenaId },
      order: [["dayOfWeek", "ASC"], ["startTime", "ASC"]]
    });

    return res.status(200).json(schedule);
  } catch (error) {
    console.error("Get manager schedule error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateManagerSlot = async (req, res) => {
  const { id } = req.params;
  const { isAvailable, price } = req.body;
  try {
    const arenaId = req.user.arenaId;
    const slot = await Schedule.findOne({ where: { id, arenaId } });
    
    if (!slot) return res.status(404).json({ message: "Time slot not found" });

    await slot.update({ isAvailable, price });
    return res.status(200).json({ message: "Slot updated successfully", data: slot });
  } catch (error) {
    console.error("Update manager slot error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getManagerCustomers = async (req, res) => {
  try {
    const arenaId = req.user.arenaId;
    
    // Find unique users who have bookings for this arena
    const bookings = await Booking.findAll({
      where: { arenaId },
      include: [{ model: User, as: "user", attributes: ["id", "username", "email", "profilePicture"] }],
      attributes: ["userId"],
      group: ["userId", "user.id"]
    });

    const customers = bookings.map(b => b.user);

    return res.status(200).json(customers);
  } catch (error) {
    console.error("Get manager customers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
