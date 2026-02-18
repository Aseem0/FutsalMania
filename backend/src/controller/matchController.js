import { Sequelize } from "sequelize";
import { Match, Arena, User } from "../model/index.js";

export const createMatch = async (req, res) => {
  try {
    const { arenaId, date, time, format, maxPlayers, skillLevel, price } = req.body;
    const hostId = req.user.id;

    console.log("Creating match with payload:", { hostId, arenaId, date, time });

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

    console.log("Match created successfully:", newMatch.id);
    
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

    console.log(`Fetched ${matches.length} matches`);
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
          // Using a subquery or literal because of the many-to-many relationship
          Sequelize.literal(`EXISTS (SELECT 1 FROM "MatchPlayers" WHERE "MatchPlayers"."matchId" = "Match"."id" AND "MatchPlayers"."userId" = ${userId})`),
        ],
      },
      include: [
        { model: Arena, as: "arena" },
        { model: User, as: "host", attributes: ["id", "username"] },
      ],
      order: [["date", "ASC"], ["time", "ASC"]],
    });

    console.log(`Fetched ${matches.length} matches for user ${userId}`);
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
