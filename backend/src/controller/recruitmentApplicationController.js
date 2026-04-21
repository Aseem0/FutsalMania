import { RecruitmentApplication, PlayerRecruitment, User, Team } from "../model/index.js";
import { createNotification } from "./notificationHelper.js";

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

    // Notify the recruitment host
    const applicant = await User.findByPk(userId, { attributes: ["username"] });
    createNotification({
      userId: recruitment.hostId,
      type: "recruitment_apply",
      title: "New Player Application",
      body: `${applicant?.username || "A player"} applied for the "${recruitment.role}" position.`,
      relatedId: recruitment.id,
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
    console.log(`[API] Fetching MyApplications for user: ${userId}`);

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
    console.log(`[API] Fetching ReceivedApplications for user: ${userId}`);

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

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    const userId = req.user.id;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    const application = await RecruitmentApplication.findByPk(id, {
      include: [{ model: PlayerRecruitment, as: "recruitment" }],
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify the user is the host of the recruitment post
    if (application.recruitment.hostId !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    // Notify the applicant
    createNotification({
      userId: application.userId,
      type: `recruitment_${status}`,
      title: status === "accepted" ? "Application Accepted!" : "Application Rejected",
      body: status === "accepted" 
        ? `Your application for "${application.recruitment.role}" has been accepted!`
        : `Your application for "${application.recruitment.role}" was not accepted.`,
      relatedId: application.recruitmentId,
    });

    res.status(200).json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Failed to update application status" });
  }
};
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await RecruitmentApplication.findByPk(id, {
      include: [{ model: PlayerRecruitment, as: "recruitment" }],
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify authorized user: Either the host (recipient) or the applicant (sender) can delete/dismiss
    if (application.recruitment.hostId !== userId && application.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this application" });
    }

    await application.destroy();

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Failed to delete recruitment application" });
  }
};
