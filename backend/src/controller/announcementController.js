import { Announcement, User, Arena } from "../model/index.js";
import { createBulkNotifications } from "./notificationHelper.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, arenaId } = req.body;
    const authorId = req.user.id; // From auth middleware

    const announcement = await Announcement.create({
      title,
      content,
      authorId,
      arenaId: arenaId || null,
    });

    // Fan-out notification to all regular users
    const allUsers = await User.findAll({
      where: { role: "user" },
      attributes: ["id"],
    });
    const userIds = allUsers.map((u) => u.id);
    if (userIds.length > 0) {
      createBulkNotifications(userIds, {
        type: "announcement",
        title: `📢 ${title}`,
        body: content.length > 120 ? content.substring(0, 117) + "..." : content,
        relatedId: announcement.id,
      });
    }

    res.status(201).json({
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username", "role"],
        },
        {
          model: Arena,
          as: "arena",
          attributes: ["name", "location"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user.id;
    const userRole = req.user.role;

    const announcement = await Announcement.findByPk(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Admins can delete any, Managers can only delete their own
    if (userRole !== "admin" && announcement.authorId !== authorId) {
      return res.status(403).json({ message: "Unauthorized to delete this announcement" });
    }

    await announcement.destroy();

    res.status(200).json({
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
