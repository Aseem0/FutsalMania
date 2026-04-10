import cron from "node-cron";
import { Op } from "sequelize";
import { Match, User } from "../model/index.js";
import { createBulkNotifications } from "../controller/notificationHelper.js";

/**
 * Runs every 15 minutes.
 * Finds matches starting within the next 60 minutes that haven't had a reminder sent,
 * fires notifications to all players, then marks the match as reminderSent.
 */
const startReminderJob = () => {
  cron.schedule("*/15 * * * *", async () => {
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      // Build today's date string (YYYY-MM-DD) and time window
      const todayStr = now.toISOString().split("T")[0];

      // Fetch open/full matches on today's date where reminderSent is false
      // We then filter in JS for matches whose time is within the next hour
      const upcomingMatches = await Match.findAll({
        where: {
          date: todayStr,
          reminderSent: false,
          status: { [Op.in]: ["open", "full"] },
        },
        include: [
          { model: User, as: "players", attributes: ["id", "username"] },
          { model: User, as: "host", attributes: ["id", "username"] },
        ],
      });

      for (const match of upcomingMatches) {
        // Parse match time "HH:MM" and build a full Date for today
        const [h, m] = match.time.split(":").map(Number);
        const matchDateTime = new Date();
        matchDateTime.setHours(h, m, 0, 0);

        const diffMs = matchDateTime.getTime() - now.getTime();

        // Only notify if the match is 0–60 minutes away
        if (diffMs > 0 && diffMs <= 60 * 60 * 1000) {
          // Collect all participant IDs (players + host)
          const playerIds = (match.players || []).map((p) => p.id);
          const allIds = [...new Set([...playerIds, match.hostId])];

          if (allIds.length > 0) {
            const minutesLeft = Math.round(diffMs / 60000);
            await createBulkNotifications(allIds, {
              type: "game_reminder",
              title: "⏰ Game Starting Soon!",
              body: `Your futsal match starts in ~${minutesLeft} minutes (${match.time}). Get ready!`,
              relatedId: match.id,
            });
          }

          // Mark as sent so we don't spam
          await match.update({ reminderSent: true });
          console.log(`[ReminderJob] Sent reminders for match ${match.id} (${match.date} ${match.time})`);
        }
      }
    } catch (err) {
      console.error("[ReminderJob] Error:", err.message);
    }
  });

  console.log("✅ Game reminder cron job started (runs every 15 minutes).");
};

export default startReminderJob;
