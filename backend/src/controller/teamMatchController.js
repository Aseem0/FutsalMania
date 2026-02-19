import { TeamMatch, Team, Arena } from "../model/index.js";

export const hostTeamMatch = async (req, res) => {
  try {
    const { teamId, arenaId, date, time, format, price } = req.body;
    const userId = req.user.id;

    // Verify user owns the team
    const team = await Team.findByPk(teamId);
    if (!team || team.ownerId !== userId) {
      return res.status(403).json({ message: "Only team owner can host a match" });
    }

    const newMatch = await TeamMatch.create({
      hostTeamId: teamId,
      arenaId,
      date,
      time,
      format,
      price,
      status: "open",
    });

    res.status(201).json(newMatch);
  } catch (error) {
    console.error("Error hosting team match:", error);
    res.status(500).json({ message: "Failed to host team match" });
  }
};

export const getTeamMatches = async (req, res) => {
  try {
    const matches = await TeamMatch.findAll({
      include: [
        { model: Team, as: "hostTeam", attributes: ["id", "name", "logo"] },
        { model: Team, as: "guestTeam", attributes: ["id", "name", "logo"] },
        { model: Arena, as: "arena" },
      ],
      order: [["date", "ASC"], ["time", "ASC"]],
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching team matches:", error);
    res.status(500).json({ message: "Failed to fetch team matches" });
  }
};

export const joinAsOpponent = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { teamId } = req.body; // The guest team ID
    const userId = req.user.id;

    const match = await TeamMatch.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.status !== "open" || match.guestTeamId) {
      return res.status(400).json({ message: "Match is no longer available for opponents" });
    }

    // Verify user owns the joining team
    const team = await Team.findByPk(teamId);
    if (!team || team.ownerId !== userId) {
      return res.status(403).json({ message: "Only team owner can join a match as opponent" });
    }

    if (match.hostTeamId === teamId) {
      return res.status(400).json({ message: "You cannot play against your own team" });
    }

    await match.update({
      guestTeamId: teamId,
      status: "scheduled",
    });

    res.status(200).json({ message: "Successfully joined as opponent" });
  } catch (error) {
    console.error("Error joining team match:", error);
    res.status(500).json({ message: "Failed to join team match" });
  }
};
