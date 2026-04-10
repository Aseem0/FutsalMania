import { User, Arena, Booking, Schedule, Match } from "../model/index.js";
import bcryptjs from "bcryptjs";
import { Op } from "sequelize";
import { createNotification } from "./notificationHelper.js";

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

export const updateManagerArena = async (req, res) => {
  try {
    const arenaId = req.user.arenaId;
    if (!arenaId) return res.status(403).json({ message: "No arena assigned to this manager" });

    const { name, location, price, image, openingHours, infrastructure } = req.body;
    const arena = await Arena.findByPk(arenaId);
    if (!arena) return res.status(404).json({ message: "Arena not found" });

    await arena.update({
      name: name || arena.name,
      location: location || arena.location,
      price: price !== undefined ? price : arena.price,
      image: image || arena.image,
      openingHours: openingHours || arena.openingHours,
      infrastructure: infrastructure || arena.infrastructure,
    });

    return res.status(200).json({ message: "Arena updated successfully", data: arena });
  } catch (error) {
    console.error("Update manager arena error:", error);
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
    const oldStatus = booking.status;
    await booking.update({ status });

    // Sync with Match if applicable
    if (booking.matchId) {
       const match = await Match.findByPk(booking.matchId);
       if (match) {
          if (status === "cancelled") {
             await match.update({ status: "cancelled" });
          } else if (status === "confirmed" && oldStatus !== "confirmed") {
             // Match remains open or full as it was, but we could add logic here if needed
          }
       }
    }

    // --- Notify the booking user ---
    if (booking.userId) {
      const arena = await Arena.findByPk(arenaId, { attributes: ["name"] });
      const arenaName = arena?.name || "the arena";

      if (status === "confirmed" && oldStatus !== "confirmed") {
        createNotification({
          userId: booking.userId,
          type: "booking_confirmed",
          title: "Booking Confirmed ✅",
          body: `Your booking at ${arenaName} on ${booking.date} (${booking.startTime}–${booking.endTime}) has been confirmed.`,
          relatedId: booking.id,
        });
      } else if (status === "cancelled" && oldStatus !== "cancelled") {
        createNotification({
          userId: booking.userId,
          type: "booking_cancelled",
          title: "Booking Cancelled",
          body: `Your booking at ${arenaName} on ${booking.date} (${booking.startTime}) has been cancelled by the manager.`,
          relatedId: booking.id,
        });
      }
    }

    return res.status(200).json({ message: "Booking updated successfully", data: booking });
  } catch (error) {
    console.error("Update manager booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getManagerSchedule = async (req, res) => {
  try {
    const arenaId = req.user.arenaId;
    const { date } = req.query; // New: optional date parameter

    // Fetch base schedule
    const schedule = await Schedule.findAll({
      where: { arenaId },
      order: [["dayOfWeek", "ASC"], ["startTime", "ASC"]]
    });

    if (!date) {
      return res.status(200).json(schedule);
    }

    // --- Real-time Availability Logic ---
    const arena = await Arena.findByPk(arenaId);
    const bookings = await Booking.findAll({
       where: { arenaId, date, status: ["pending", "confirmed"] },
       include: [
         { model: User, as: "user", attributes: ["username"] },
         { model: Match, as: "match", attributes: ["id", "hostId"] }
       ]
    });

    return res.status(200).json({
       arena: {
          openingHours: arena.openingHours,
          name: arena.name
       },
       baseSchedule: schedule,
       bookings: bookings
    });
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
    
    // Find unique registered users who have bookings for this arena
    const bookings = await Booking.findAll({
      where: { 
        arenaId,
        userId: { [Op.ne]: null } // Only registered users
      },
      include: [{ 
        model: User, 
        as: "user", 
        attributes: ["id", "username", "email", "profilePicture"] 
      }],
      attributes: ["userId"],
      group: ["userId", "user.id", "user.username", "user.email", "user.profilePicture"]
    });

    const customers = bookings.map(b => b.user);

    return res.status(200).json(customers);
  } catch (error) {
    console.error("Get manager customers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteManagerBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const arenaId = req.user.arenaId;
    const booking = await Booking.findOne({ where: { id, arenaId } });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // If it's linked to a match, delete the match as well
    if (booking.matchId) {
       await Match.destroy({ where: { id: booking.matchId } });
    }

    await booking.destroy();

    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete manager booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createManagerBooking = async (req, res) => {
  try {
    const arenaId = req.user.arenaId;
    const { date, startTime, customerName, totalPrice } = req.body;

    // 1. Conflict Check
    const existingBooking = await Booking.findOne({
      where: {
        arenaId,
        date,
        startTime,
        status: ["pending", "confirmed"]
      }
    });

    if (existingBooking) {
      return res.status(409).json({ message: "This slot is already booked." });
    }

    // 2. Calculate endTime (assume 1hr)
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = (hours + 1).toString().padStart(2, "0");
    const endTime = `${endHours}:${minutes.toString().padStart(2, "0")}`;

    // 3. Create Booking
    const newBooking = await Booking.create({
      arenaId,
      date,
      startTime,
      endTime,
      totalPrice: totalPrice || 0,
      customerName: customerName || "Walk-in Customer",
      status: "confirmed",
      userId: null // Manual bookings don't necessarily have a registered user
    });

    return res.status(201).json({ message: "Manual booking created", data: newBooking });
  } catch (error) {
    console.error("Create manager booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
