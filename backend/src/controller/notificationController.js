import { Notification } from "../model/index.js";
import { Op } from "sequelize";

// GET /notifications — all notifications for logged-in user, newest first
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 100,
    });
    res.json(notifications);
  } catch (err) {
    console.error("getUserNotifications:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// GET /notifications/unread-count — returns { count: N }
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { userId: req.user.id, isRead: false },
    });
    res.json({ count });
  } catch (err) {
    console.error("getUnreadCount:", err);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};

// PATCH /notifications/:id/read — mark one as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    await notification.update({ isRead: true });
    res.json({ success: true });
  } catch (err) {
    console.error("markAsRead:", err);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

// PATCH /notifications/read-all — mark all of user's notifications as read
export const markAllRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("markAllRead:", err);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};

// DELETE /notifications/:id — delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    await notification.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error("deleteNotification:", err);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// POST /notifications/clear-all — clear all of user's notifications
export const clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      console.error("[NotificationController] No userId found in req.user");
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID" });
    }

    console.log(`[NotificationController] Attempting to clear notifications for user ${userId}...`);
    
    // First, check how many exist
    const countBefore = await Notification.count({ where: { userId } });
    
    const deletedCount = await Notification.destroy({
      where: { userId },
    });
    
    console.log(`[NotificationController] User ${userId}: found ${countBefore}, deleted ${deletedCount}.`);
    
    res.json({ 
      success: true, 
      count: deletedCount,
      previousCount: countBefore 
    });
  } catch (err) {
    console.error("[NotificationController] clearAllNotifications Error:", err);
    res.status(500).json({ 
      message: "Failed to clear notifications", 
      error: err.message,
      success: false 
    });
  }
};
