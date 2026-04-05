import { Tournament } from "../model/index.js";

export const createTournament = async (req, res) => {
  try {
    const { name, description, date, location, entryFee, prizePool, maxTeams, image } = req.body;
    
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create tournaments" });
    }

    const tournament = await Tournament.create({
      name,
      description,
      date,
      location,
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

export const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.findAll({
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

    const tournament = await Tournament.findByPk(id);
    
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
