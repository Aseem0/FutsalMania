import { Sequelize } from "sequelize";
import { TeamMatch, Team, Arena, User, Booking } from "../model/index.js";
import { createNotification } from "./notificationHelper.js";

export const hostTeamMatch = async (req, res) => {
  try {
    const { teamId, customTeamName, arenaId, date, time, format, price, contactNumber } = req.body;
    const userId = req.user.id;

    // Check if date/time is in the past
    const currentDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kathmandu" });
    const currentTime = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kathmandu", hour12: false }).substring(0, 5);

    if (date < currentDate) {
      return res.status(400).json({ message: "Cannot host a match in the past." });
    }
    if (date === currentDate && time < currentTime) {
      return res.status(400).json({ message: "This time has already passed today." });
    }

    // If a formal team is provided, we can still check it, 
    // but we don't block the request if any user wants to host as "Organizer"
    let verifiedTeamId = null;
    if (teamId) {
      const team = await Team.findByPk(teamId);
      if (team) {
        verifiedTeamId = team.id;
      }
    }

    // Check if slot is already booked
    const existingBooking = await Booking.findOne({
      where: {
        arenaId,
        date,
        startTime: time,
        status: ["pending", "confirmed"],
      }
    });

    if (existingBooking) {
      return res.status(409).json({ message: "This slot is already booked. Please choose another time." });
    }

    // Get true arena price
    const arena = await Arena.findByPk(arenaId, { attributes: ["name", "price"] });
    if (!arena) {
      return res.status(404).json({ message: "Arena not found." });
    }

    const newMatch = await TeamMatch.create({
      hostTeamId: verifiedTeamId,
      customTeamName: customTeamName || (verifiedTeamId ? null : "Squad Alpha"), // Fallback if needed
      hostId: userId,
      arenaId,
      date,
      time,
      format,
      price: price || 0,
      contactNumber,
      status: "open",
    });

    // Create the booking record
    const [hours, minutes] = time.split(":").map(Number);
    const endHours = (hours + 1).toString().padStart(2, "0");
    const endTime = `${endHours}:${minutes.toString().padStart(2, "0")}`;

    await Booking.create({
       date,
       startTime: time,
       endTime: endTime,
       totalPrice: arena.price || 0,
       status: "pending", // SOFT BOOKING AWAITING OPPONENT
       arenaId,
       userId: userId,
       teamMatchId: newMatch.id
    });

    res.status(201).json(newMatch);
  } catch (error) {
    console.error("Error hosting team match:", error);
    res.status(500).json({ message: "Failed to host team match" });
  }
};

export const getTeamMatches = async (req, res) => {
  try {
    const currentDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kathmandu" });
    const currentTime = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kathmandu", hour12: false }).substring(0, 5);

    const matches = await TeamMatch.findAll({
      where: {
        status: { [Sequelize.Op.in]: ["open", "scheduled"] },
        [Sequelize.Op.or]: [
          { date: { [Sequelize.Op.gt]: currentDate } },
          {
            [Sequelize.Op.and]: [
              { date: currentDate },
              { time: { [Sequelize.Op.gte]: currentTime } },
            ],
          },
        ],
      },
      include: [
        { model: Team, as: "hostTeam", attributes: ["id", "name", "logo"] },
        { model: Team, as: "guestTeam", attributes: ["id", "name", "logo"] },
        { model: Arena, as: "arena" },
        { model: User, as: "host", attributes: ["id", "username", "profilePicture"] }
      ],
      order: [["date", "ASC"], ["time", "ASC"]],
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching team matches:", error);
    res.status(500).json({ message: "Failed to fetch team matches" });
  }
};

export const getTeamMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await TeamMatch.findByPk(id, {
      include: [
        { model: Team, as: "hostTeam", attributes: ["id", "name", "logo"] },
        { model: Team, as: "guestTeam", attributes: ["id", "name", "logo"] },
        { model: Arena, as: "arena" },
        { model: User, as: "host", attributes: ["id", "username", "profilePicture"] }
      ],
    });

    if (!match) {
      return res.status(404).json({ message: "Team match not found" });
    }

    res.status(200).json(match);
  } catch (error) {
    console.error("Error fetching team match:", error);
    res.status(500).json({ message: "Failed to fetch team match" });
  }
};

export const getMyTeamMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kathmandu" });
    const currentTime = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kathmandu", hour12: false }).substring(0, 5);

    const matches = await TeamMatch.findAll({
      where: {
        [Sequelize.Op.and]: [
          {
            [Sequelize.Op.or]: [
              { hostId: userId },
              { guestId: userId },
            ],
          },
          {
            status: { [Sequelize.Op.notIn]: ["cancelled", "completed"] },
            [Sequelize.Op.or]: [
              { date: { [Sequelize.Op.gt]: currentDate } },
              {
                [Sequelize.Op.and]: [
                  { date: currentDate },
                  { time: { [Sequelize.Op.gte]: currentTime } },
                ],
              },
            ],
          },
        ],
      },
      include: [
        { model: Team, as: "hostTeam", attributes: ["id", "name", "logo"] },
        { model: Team, as: "guestTeam", attributes: ["id", "name", "logo"] },
        { model: Arena, as: "arena" },
        { model: User, as: "host", attributes: ["id", "username", "profilePicture"] }
      ],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching my team matches:", error);
    res.status(500).json({ message: "Failed to fetch your team matches" });
  }
};

export const joinAsOpponent = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { teamId, customTeamName, contactNumber } = req.body;
    const userId = req.user.id;

    const match = await TeamMatch.findByPk(matchId, {
      include: [{ model: Arena, as: "arena" }]
    });
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.status !== "open" || match.guestTeamId || match.guestCustomTeamName) {
      return res.status(400).json({ message: "Match is no longer available for opponents" });
    }

    if (!contactNumber) {
      return res.status(400).json({ message: "Contact information is required to challenge." });
    }

    let verifiedTeamId = null;
    let joinedTeamName = customTeamName || "a new squad";

    if (teamId) {
      // Verify user owns the joining team
      const team = await Team.findByPk(teamId);
      if (!team || team.ownerId !== userId) {
        return res.status(403).json({ message: "Only the team owner can join a match as a formal team." });
      }
      if (match.hostTeamId === teamId) {
        return res.status(400).json({ message: "You cannot play against your own team." });
      }
      verifiedTeamId = teamId;
      joinedTeamName = team.name;
    }

    await match.update({
      guestTeamId: verifiedTeamId,
      guestId: userId,
      guestCustomTeamName: customTeamName || null,
      guestContactNumber: contactNumber,
      status: "scheduled",
    });

    // Mark the Booking as confirmed so it's fully locked
    const booking = await Booking.findOne({ where: { teamMatchId: match.id } });
    if (booking) {
      await booking.update({ status: "confirmed" });
    }

    // --- Notifications ---
    // Notify the Host: challenge accepted
    createNotification({
      userId: match.hostId,
      type: "match_join",
      title: "🔥 Challenge Accepted!",
      body: `${joinedTeamName} has accepted your team challenge at ${match.arena?.name || "the arena"} for ${match.date} at ${match.time}.`,
      relatedId: match.id,
    });

    res.status(200).json({ message: "Successfully joined as opponent" });
  } catch (error) {
    console.error("Error joining team match:", error);
    res.status(500).json({ message: "Failed to join team match" });
  }
};

export const deleteTeamMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(req.user.id);

    const match = await TeamMatch.findByPk(id);
    if (!match) {
      return res.status(404).json({ message: "Team match not found" });
    }

    // Only host or admin can delete
    if (Number(match.hostId) !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only the host or an administrator can delete this challenge" });
    }

    await match.destroy();

    res.status(200).json({ message: "Team match deleted successfully" });
  } catch (error) {
    console.error("[DeleteTeamMatch] Critical Error:", error);
    res.status(500).json({ message: "Failed to delete team match: " + error.message });
  }
};
