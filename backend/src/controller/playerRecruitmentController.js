import { PlayerRecruitment, User, Team } from "../model/index.js";
import { Op } from "sequelize";

export const createRecruitment = async (req, res) => {
  try {
    const { role, level, date, time, playersNeeded, description, teamId } = req.body;
    const hostId = req.user.id;

    const recruitment = await PlayerRecruitment.create({
      role,
      level,
      date,
      time,
      playersNeeded,
      description,
      teamId,
      hostId,
    });

    res.status(201).json(recruitment);
  } catch (error) {
    console.error("Error creating recruitment:", error);
    res.status(500).json({ message: "Failed to create recruitment post" });
  }
};

export const getRecruitments = async (req, res) => {
  try {
    const { role, level, date } = req.query;
    const where = { status: "open" };

    if (role) where.role = role;
    if (level) where.level = level;
    if (date) where.date = date;

    const recruitments = await PlayerRecruitment.findAll({
      where,
      include: [
        { model: User, as: "host", attributes: ["id", "username", "profilePicture"] },
        { model: Team, as: "team", attributes: ["id", "name", "logo"] },
      ],
      order: [["date", "ASC"], ["time", "ASC"]],
    });

    res.status(200).json(recruitments);
  } catch (error) {
    console.error("Error fetching recruitments:", error);
    res.status(500).json({ message: "Failed to fetch recruitments" });
  }
};
