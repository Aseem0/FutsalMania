import { Tournament, Arena } from "../model/index.js";

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
    const tournaments = await Tournament.findAll({
      include: [{ model: Arena, as: "arena" }],
      order: [["date", "ASC"]],
    });
    res.status(200).json(tournaments);
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

    res.status(200).json(tournament);
  } catch (error) {
    // Handle Postgres/Sequelize error for invalid integer syntax
    if (error.name === 'SequelizeDatabaseError' && error.parent?.code === '22P02') {
      return res.status(400).json({ message: "Invalid tournament ID format" });
    }
    console.error("Get tournament by id error:", error);
    res.status(500).json({ message: "Failed to fetch tournament" });
  }
};
