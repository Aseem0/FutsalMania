import { Sequelize } from "sequelize";
import { Match, Arena, User, Booking } from "../model/index.js";
import { createNotification } from "./notificationHelper.js";

export const createMatch = async (req, res) => {
  try {
    const { arenaId, date, time, format, maxPlayers, skillLevel, price } = req.body;
    const hostId = req.user.id;

    // Check for existing bookings at this time and arena
    const existingBooking = await Booking.findOne({
      where: {
        arenaId,
        date,
        startTime: time,
        status: ["pending", "confirmed"], // Only block if active
      }
    });

    if (existingBooking) {
      return res.status(409).json({ message: "This slot is already booked. Please choose another time." });
    }

    const newMatch = await Match.create({
      hostId,
      arenaId,
      date,
      time,
      format,
      maxPlayers,
      skillLevel,
      price,
    });

    
    // Automatically add the host as the first player in the MatchPlayers table
    await newMatch.addPlayer(hostId);

    // Automatically create a Booking
    // Calculate endTime (assume 1 hour)
    const [hours, minutes] = time.split(":").map(Number);
    const endHours = (hours + 1).toString().padStart(2, "0");
    const endTime = `${endHours}:${minutes.toString().padStart(2, "0")}`;

    await Booking.create({
       date,
       startTime: time,
       endTime: endTime,
       totalPrice: price,
       status: "confirmed", // AUTO-CONFIRM
       arenaId,
       userId: hostId,
       matchId: newMatch.id
    });

    // Notify the host that their game was created successfully
    const arena = await Arena.findByPk(arenaId, { attributes: ["name"] });
    createNotification({
      userId: hostId,
      type: "match_join",
      title: "🏟️ Game Hosted Successfully!",
      body: `Your ${format} match at ${arena?.name || "the arena"} on ${date} at ${time} is now live. Share it so players can join!`,
      relatedId: newMatch.id,
    });

    res.status(201).json(newMatch);

  } catch (error) {
    console.error("Error creating match:", error);
    res.status(500).json({ message: "Failed to create match" });
  }
};

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      include: [
        { model: Arena, as: "arena" },
        { model: User, as: "host", attributes: ["id", "username"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Failed to fetch matches" });
  }
};

export const getMyMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const matches = await Match.findAll({
      where: {
        [Sequelize.Op.or]: [
          { hostId: userId },
          Sequelize.where(
            Sequelize.literal(`(SELECT COUNT(*) FROM "MatchPlayers" WHERE "MatchPlayers"."matchId" = "Match"."id" AND "MatchPlayers"."userId" = :userId)`),
            { [Sequelize.Op.gt]: 0 }
          ),
        ],
      },
      replacements: { userId },
      include: [
        { model: Arena, as: "arena" },
        { model: User, as: "host", attributes: ["id", "username"] },
      ],
      order: [["date", "ASC"], ["time", "ASC"]],
    });
    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching user matches:", error);
    res.status(500).json({ message: "Failed to fetch user matches" });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findByPk(id, {
      include: [
        { model: Arena, as: "arena" },
        { model: User, as: "host", attributes: ["id", "username", "profilePicture"] },
        { model: User, as: "players", attributes: ["id", "username", "profilePicture"] },
      ],
    });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json(match);
  } catch (error) {
    console.error("Error fetching match details:", error);
    res.status(500).json({ message: "Failed to fetch match details" });
  }
};

export const joinMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const match = await Match.findByPk(id, {
      include: [{ model: User, as: "players" }],
    });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.status !== "open") {
      return res.status(400).json({ message: "Match is no longer open" });
    }

    // Check if user is already in the match
    const isPlayer = match.players.some((player) => player.id === userId);
    if (isPlayer || match.hostId === userId) {
      return res.status(400).json({ message: "You are already in this match" });
    }

    // Check capacity
    if (match.currentPlayers >= match.maxPlayers) {
      return res.status(400).json({ message: "Match is full" });
    }

    // Add player
    await match.addPlayer(userId);
    
    // Update currentPlayers count
    await match.increment("currentPlayers");

    // Refresh match data to check if it's now full
    const updatedMatch = await Match.findByPk(id);
    const isNowFull = updatedMatch.currentPlayers >= updatedMatch.maxPlayers;
    if (isNowFull) {
      await updatedMatch.update({ status: "full" });
    }

    // --- Notifications ---
    // Notify host: player joined
    if (match.hostId !== userId) {
      const joiner = await User.findByPk(userId, { attributes: ["username"] });
      createNotification({
        userId: match.hostId,
        type: "match_join",
        title: "Player Joined Your Match",
        body: `${joiner?.username || "A player"} joined your match on ${match.date} at ${match.time}.`,
        relatedId: match.id,
      });

      // Notify host: match is now full
      if (isNowFull) {
        createNotification({
          userId: match.hostId,
          type: "match_full",
          title: "Your Match is Full!",
          body: `Your match on ${match.date} at ${match.time} has reached max capacity.`,
          relatedId: match.id,
        });
      }
    }

    res.status(200).json({ message: "Successfully joined the match" });
  } catch (error) {
    console.error("Error joining match:", error);
    res.status(500).json({ message: "Failed to join match" });
  }
};

export const leaveMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(req.user.id);

    const match = await Match.findByPk(id, {
      include: [{ model: User, as: "players", attributes: ["id"] }],
    });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Check if user is actually in the match
    const isMember = match.players.some(player => Number(player.id) === userId);
    
    if (!isMember) {
      return res.status(400).json({ message: "You are not a member of this squad" });
    }

    // Remove player from the join table
    await match.removePlayer(userId);

    // Decrement currentPlayers count
    await match.decrement("currentPlayers");

    // Update status if it was full
    const updatedMatch = await match.reload();
    if (updatedMatch.status === "full" && updatedMatch.currentPlayers < updatedMatch.maxPlayers) {
      await updatedMatch.update({ status: "open" });
    }

    res.status(200).json({ message: "Successfully left the match" });
  } catch (error) {
    console.error("[LeaveMatch] Critical Error:", error);
    res.status(500).json({ message: "Failed to leave match: " + error.message });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(req.user.id);

    const match = await Match.findByPk(id);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Only host or admin can delete
    if (Number(match.hostId) !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only the host or an administrator can delete this match" });
    }

    await match.destroy();

    res.status(200).json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error("[DeleteMatch] Critical Error:", error);
    res.status(500).json({ message: "Failed to delete match: " + error.message });
  }
};
