import { Team, User } from "../model/index.js";

export const createTeam = async (req, res) => {
  try {
    const { name, logo, description } = req.body;
    const ownerId = req.user.id;

    const existingTeam = await Team.findOne({ where: { name } });
    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    const newTeam = await Team.create({
      name,
      logo,
      description,
      ownerId,
    });

    // Add owner as the first member
    await newTeam.addMember(ownerId);

    res.status(201).json(newTeam);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Failed to create team" });
  }
};

export const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id;
    const teams = await Team.findAll({
      where: { ownerId: userId },
      include: [
        { model: User, as: "members", attributes: ["id", "username", "profilePicture"] }
      ]
    });

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Failed to fetch teams" });
  }
};

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        { model: User, as: "members", attributes: ["id", "username", "profilePicture"] },
        { model: User, as: "owner", attributes: ["id", "username"] }
      ]
    });
    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching all teams:", error);
    res.status(500).json({ message: "Failed to fetch teams" });
  }
};
