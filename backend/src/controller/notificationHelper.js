import { Notification } from "../model/index.js";

/**
 * Creates a single notification record.
 * @param {{ userId: number, type: string, title: string, body: string, relatedId?: number }} param0
 */
export const createNotification = async ({ userId, type, title, body, relatedId = null }) => {
  try {
    await Notification.create({ userId, type, title, body, relatedId });
  } catch (err) {
    // Never crash the parent request because of a notification failure
    console.error("[NotificationHelper] Failed to create notification:", err.message);
  }
};

/**
 * Creates notifications in bulk (e.g. fan-out to all users for announcements).
 * @param {number[]} userIds
 * @param {{ type: string, title: string, body: string, relatedId?: number }} payload
 */
export const createBulkNotifications = async (userIds, { type, title, body, relatedId = null }) => {
  try {
    const records = userIds.map((userId) => ({
      userId,
      type,
      title,
      body,
      relatedId,
      isRead: false,
      createdAt: new Date(),
    }));
    await Notification.bulkCreate(records);
  } catch (err) {
    console.error("[NotificationHelper] Bulk create failed:", err.message);
  }
};
