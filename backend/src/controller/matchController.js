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
      where: { hostId: userId },
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
