import { PlayerRecruitment, User, Team } from "../model/index.js";
import { Op } from "sequelize";

export const createRecruitment = async (req, res) => {
  try {
    const { role, level, date, time, playersNeeded, description, teamId, contactNumber } = req.body;
    const hostId = req.user.id;

    if (!contactNumber) {
      return res.status(400).json({ message: "Contact number is required so applicants can reach you." });
    }

    const recruitment = await PlayerRecruitment.create({
      role,
      level,
      date,
      time,
      playersNeeded,
      description,
      teamId,
      hostId,
      contactNumber,
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
    const currentDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kathmandu" });
    const currentTime = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kathmandu", hour12: false }).substring(0, 5);

    const where = { 
      status: "open",
      [Op.and]: [
        {
          [Op.or]: [
            { date: { [Op.gt]: currentDate } },
            { 
              [Op.and]: [
                { date: currentDate },
                { time: { [Op.gte]: currentTime } }
              ]
            }
          ]
        }
      ]
    };

    if (role) where.role = role;
    if (level) where.level = level;
    if (date) {
      // If a specific date is requested, we still respect the "upcoming" rule if it's today
      where.date = date;
    }

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

export const deleteRecruitment = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = req.user.id;

    const recruitment = await PlayerRecruitment.findByPk(id);

    if (!recruitment) {
      return res.status(404).json({ message: "Recruitment post not found" });
    }

    if (recruitment.hostId !== hostId) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    await recruitment.destroy();

    res.status(200).json({ message: "Recruitment post deleted successfully" });
  } catch (error) {
    console.error("Error deleting recruitment:", error);
    res.status(500).json({ message: "Failed to delete recruitment post" });
  }
};
