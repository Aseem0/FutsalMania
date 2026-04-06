import { Sequelize } from "sequelize";
import { Match, Arena, User } from "../model/index.js";

export const createMatch = async (req, res) => {
  try {
    const { arenaId, date, time, format, maxPlayers, skillLevel, price } = req.body;
    const hostId = req.user.id;


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
    if (updatedMatch.currentPlayers >= updatedMatch.maxPlayers) {
      await updatedMatch.update({ status: "full" });
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
