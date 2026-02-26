import { RecruitmentApplication, PlayerRecruitment, User, Team } from "../model/index.js";

export const applyToRecruitment = async (req, res) => {
  try {
    const { id: recruitmentId } = req.params;
    const userId = req.user.id;

    // Check if recruitment exists
    const recruitment = await PlayerRecruitment.findByPk(recruitmentId);
    if (!recruitment) {
      return res.status(404).json({ message: "Recruitment post not found" });
    }

    // Creator cannot apply to their own post
    if (recruitment.hostId === userId) {
      return res.status(400).json({ message: "You cannot apply to your own post" });
    }

    // Check if already applied
    const existingApplication = await RecruitmentApplication.findOne({
      where: { userId, recruitmentId },
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this post" });
    }

    const application = await RecruitmentApplication.create({
      userId,
      recruitmentId,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Error applying to recruitment:", error);
    res.status(500).json({ message: "Failed to apply to recruitment" });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await RecruitmentApplication.findAll({
      where: { userId },
      include: [
        {
          model: PlayerRecruitment,
          as: "recruitment",
          include: [
            { model: User, as: "host", attributes: ["id", "username", "profilePicture"] },
            { model: Team, as: "team", attributes: ["id", "name", "logo"] },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching my applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

export const getReceivedApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await RecruitmentApplication.findAll({
      include: [
        {
          model: PlayerRecruitment,
          as: "recruitment",
          where: { hostId: userId },
          include: [{ model: Team, as: "team", attributes: ["id", "name"] }],
        },
        {
          model: User,
          as: "applicant",
          attributes: ["id", "username", "profilePicture"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching received applications:", error);
    res.status(500).json({ message: "Failed to fetch received applications" });
  }
};
