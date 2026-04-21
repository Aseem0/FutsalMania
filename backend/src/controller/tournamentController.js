import { Op } from "sequelize";
import { Tournament, Arena, TournamentRegistration, User } from "../model/index.js";

export const createTournament = async (req, res) => {
  try {
    const { name, description, date, location, arenaId, entryFee, prizePool, maxTeams, image } = req.body;
    
    // Check if user is admin (case-insensitive)
    const role = req.user.role?.toLowerCase();
    if (role !== "admin") {
      return res.status(403).json({ message: "Only admins can create tournaments" });
    }

    const tournament = await Tournament.create({
      name,
      description,
      date,
      location,
      arenaId,
      entryFee,
      prizePool,
      maxTeams,
      image,
    });

    res.status(201).json({
      message: "Tournament created successfully",
      tournament,
    });
  } catch (error) {
    console.error("Create tournament error:", error);
    res.status(500).json({ message: "Failed to create tournament" });
  }
};

export const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date, location, arenaId, entryFee, prizePool, maxTeams, image } = req.body;
    
    // Check if user is admin
    const role = req.user.role?.toLowerCase();
    if (role !== "admin") {
      return res.status(403).json({ message: "Only admins can update tournaments" });
    }

    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    await tournament.update({
      name,
      description,
      date,
      location,
      arenaId,
      entryFee,
      prizePool,
      maxTeams,
      image,
    });

    res.status(200).json({
      message: "Tournament updated successfully",
      tournament,
    });
  } catch (error) {
    console.error("Update tournament error:", error);
    res.status(500).json({ message: "Failed to update tournament" });
  }
};

export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin
    const role = req.user.role?.toLowerCase();
    if (role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete tournaments" });
    }

    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    await tournament.destroy();

    res.status(200).json({
      message: "Tournament deleted successfully",
    });
  } catch (error) {
    console.error("Delete tournament error:", error);
    res.status(500).json({ message: "Failed to delete tournament" });
  }
};

export const getTournaments = async (req, res) => {
  try {
    const now = new Date();
    // Use Midnight today as the floor so we don't hide events happening today
    now.setHours(0, 0, 0, 0);

    const tournaments = await Tournament.findAll({
      where: {
        status: { [Op.in]: ["upcoming", "ongoing"] },
        date: { [Op.gte]: now },
      },
      include: [{ model: Arena, as: "arena" }],
      order: [["date", "ASC"]],
    });

    // Add registration counts to each tournament
    const tournamentsWithCounts = await Promise.all(tournaments.map(async (t) => {
      const count = await TournamentRegistration.count({
        where: { tournamentId: t.id, status: { [Op.ne]: 'cancelled' } }
      });
      return {
        ...t.toJSON(),
        registeredTeams: count
      };
    }));

    res.status(200).json(tournamentsWithCounts);
  } catch (error) {
    console.error("Get tournaments error:", error);
    res.status(500).json({ message: "Failed to fetch tournaments" });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID is a number
    if (isNaN(id) || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid tournament ID format" });
    }

    const tournament = await Tournament.findByPk(id, {
      include: [{ model: Arena, as: "arena" }],
    });
    
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // Get real registration count
    const registeredTeams = await TournamentRegistration.count({
      where: { tournamentId: id, status: { [Op.ne]: 'cancelled' } }
    });

    // Merge count into the object
    const tournamentData = {
      ...tournament.toJSON(),
      registeredTeams
    };

    res.status(200).json(tournamentData);
  } catch (error) {
    // Handle Postgres/Sequelize error for invalid integer syntax
    if (error.name === 'SequelizeDatabaseError' && error.parent?.code === '22P02') {
      return res.status(400).json({ message: "Invalid tournament ID format" });
    }
    console.error("Get tournament by id error:", error);
    res.status(500).json({ message: "Failed to fetch tournament" });
  }
};

export const registerForTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamName, contactNumber, playersList } = req.body;
    const userId = req.user.id;

    if (!teamName || !contactNumber || !playersList) {
      return res.status(400).json({ message: "Team name, contact number, and players list are all required" });
    }

    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // Check if tournament is upcoming
    if (tournament.status !== 'upcoming') {
      return res.status(400).json({ message: "Registrations are closed for this tournament" });
    }

    // Check if already registered
    const existingRegistration = await TournamentRegistration.findOne({
      where: { tournamentId: id, userId }
    });
    if (existingRegistration) {
      return res.status(400).json({ message: "You have already registered a team for this tournament" });
    }

    // Check max teams
    const currentRegistrations = await TournamentRegistration.count({
      where: { tournamentId: id, status: { [Op.ne]: 'cancelled' } }
    });

    if (currentRegistrations >= tournament.maxTeams) {
      return res.status(400).json({ message: "This tournament has reached its maximum team limit" });
    }

    const registration = await TournamentRegistration.create({
      tournamentId: id,
      userId,
      teamName,
      contactNumber,
      playersList,
      status: 'pending'
    });

    res.status(201).json({
      message: "Team registered successfully! Awaiting confirmation.",
      registration
    });
  } catch (error) {
    console.error("Tournament registration error:", error);
    res.status(500).json({ message: "Failed to register for tournament" });
  }
};

export const getTournamentRegistrations = async (req, res) => {
  try {
    const { id } = req.params;
    const registrations = await TournamentRegistration.findAll({
      where: { tournamentId: id },
      include: [{ model: User, as: "user", attributes: ["username", "email"] }],
      order: [["createdAt", "DESC"]]
    });
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Get tournament registrations error:", error);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};

export const deleteTournamentRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const registration = await TournamentRegistration.findByPk(registrationId);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    await registration.destroy();

    res.status(200).json({ message: "Registration removed successfully" });
  } catch (error) {
    console.error("Delete tournament registration error:", error);
    res.status(500).json({ message: "Failed to remove registration" });
  }
};
