import { Router } from "express";
import {
  loginController,
  registerController,
  updateProfileController,
  getProfileController,
  getUsersCountController,
  getAllUsersController,
  deleteUserController,
  verifyOTPController,
  resendOTPController,
  forgotPasswordController,
  resetPasswordController,
  adminCreateUserController,
} from "../controller/userController.js";
import { getArenas, createArena, updateArena, deleteArena, getArenaAvailability } from "../controller/arenaController.js";
import {
  createMatch,
  getMatches,
  getMyMatches,
  getMatchById,
  joinMatch,
  leaveMatch,
  deleteMatch,
} from "../controller/matchController.js";
import { createTeam, getMyTeams, getAllTeams } from "../controller/teamController.js";
import { hostTeamMatch, getTeamMatches, getTeamMatchById, joinAsOpponent, deleteTeamMatch, getMyTeamMatches } from "../controller/teamMatchController.js";
import { createRecruitment, getRecruitments, deleteRecruitment } from "../controller/playerRecruitmentController.js";
import {
  applyToRecruitment,
  getMyApplications,
  getReceivedApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../controller/recruitmentApplicationController.js";
import {
  createTournament,
  getTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  registerForTournament,
  getTournamentRegistrations,
  deleteTournamentRegistration,
} from "../controller/tournamentController.js";
import {
  createManager,
  getManagers,
  deleteManager,
  updateManager,
  updateManagerStatus,
  getManagerArena,
  getManagerBookings,
  updateManagerBooking,
  getManagerSchedule,
  updateManagerSlot,
  getManagerCustomers,
  getAllBookings,
  updateManagerArena,
  createManagerBooking,
  deleteManagerBooking,
} from "../controller/managerController.js";
import {
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
} from "../controller/announcementController.js";
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllRead,
  deleteNotification,
  clearAllNotifications,
} from "../controller/notificationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const managerMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Manager role required." });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin role required." });
  }
};

const adminOrManagerMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin or Manager role required." });
  }
};

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/verify-otp", verifyOTPController);
router.post("/resend-otp", resendOTPController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.get("/arenas", getArenas);
router.get("/arenas/:id/slots", getArenaAvailability);
router.post("/arenas", authMiddleware, adminMiddleware, createArena);
router.put("/arenas/:id", authMiddleware, adminMiddleware, updateArena);
router.delete("/arenas/:id", authMiddleware, adminMiddleware, deleteArena);

// User Routes
router.get("/users/profile", authMiddleware, getProfileController);
router.put("/users/profile", authMiddleware, updateProfileController);
router.get("/users/count", authMiddleware, getUsersCountController);
router.get("/users", authMiddleware, getAllUsersController);
router.post("/users/admin", authMiddleware, adminMiddleware, adminCreateUserController);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUserController);
router.get("/bookings", authMiddleware, adminMiddleware, getAllBookings);

// Match Routes (Individual)
router.post("/matches", authMiddleware, createMatch);
router.get("/matches", getMatches);
router.get("/matches/my", authMiddleware, getMyMatches);
router.get("/matches/:id", getMatchById);
router.post("/matches/:id/join", authMiddleware, joinMatch);
router.delete("/matches/:id/leave", authMiddleware, leaveMatch);
router.delete("/matches/:id", authMiddleware, deleteMatch);

// Team Routes
router.post("/teams", authMiddleware, createTeam);
router.get("/teams/my", authMiddleware, getMyTeams);
router.get("/teams", getAllTeams);

// Team Match Routes
router.post("/team-matches", authMiddleware, hostTeamMatch);
router.get("/team-matches", getTeamMatches);
router.get("/team-matches/my", authMiddleware, getMyTeamMatches);
router.get("/team-matches/:id", getTeamMatchById);
router.post("/team-matches/:matchId/join", authMiddleware, joinAsOpponent);
router.delete("/team-matches/:id", authMiddleware, deleteTeamMatch);

// Recruitment Routes
router.post("/recruitments", authMiddleware, createRecruitment);
router.get("/recruitments", getRecruitments);
router.delete("/recruitments/:id", authMiddleware, deleteRecruitment);
router.post("/recruitments/:id/apply", authMiddleware, applyToRecruitment);
router.get("/recruitments/applications/my", authMiddleware, getMyApplications);
router.get("/recruitments/applications/received", authMiddleware, getReceivedApplications);
router.patch("/recruitments/applications/:id", authMiddleware, updateApplicationStatus);
router.delete("/recruitments/applications/:id", authMiddleware, deleteApplication);

// Tournament Routes
router.post("/tournaments", authMiddleware, adminMiddleware, createTournament);
router.get("/tournaments", getTournaments);
router.get("/tournaments/:id", getTournamentById);
router.put("/tournaments/:id", authMiddleware, adminMiddleware, updateTournament);
router.delete("/tournaments/:id", authMiddleware, adminMiddleware, deleteTournament);
router.post("/tournaments/:id/register", authMiddleware, registerForTournament);
router.get("/tournaments/:id/registrations", authMiddleware, adminOrManagerMiddleware, getTournamentRegistrations);
router.delete("/tournaments/registrations/:registrationId", authMiddleware, adminOrManagerMiddleware, deleteTournamentRegistration);

// Manager Management (Admin only)
router.post("/managers", authMiddleware, createManager);
router.get("/managers", authMiddleware, getManagers);
router.put("/managers/:id", authMiddleware, adminMiddleware, updateManager);
router.delete("/managers/:id", authMiddleware, deleteManager);
router.patch("/managers/:id", authMiddleware, updateManagerStatus);

// Manager Module Routes (Manager restricted)
router.get("/manager/arena", authMiddleware, managerMiddleware, getManagerArena);
router.put("/manager/arena", authMiddleware, managerMiddleware, updateManagerArena);
router.get("/manager/bookings", authMiddleware, managerMiddleware, getManagerBookings);
router.patch("/manager/bookings/:id", authMiddleware, managerMiddleware, updateManagerBooking);
router.get("/manager/schedule", authMiddleware, managerMiddleware, getManagerSchedule);
router.patch("/manager/schedule/:id", authMiddleware, managerMiddleware, updateManagerSlot);
router.post("/manager/bookings", authMiddleware, managerMiddleware, createManagerBooking);
router.delete("/manager/bookings/:id", authMiddleware, managerMiddleware, deleteManagerBooking);
router.get("/manager/customers", authMiddleware, managerMiddleware, getManagerCustomers);

// Announcement Routes
router.post("/announcements", authMiddleware, adminOrManagerMiddleware, createAnnouncement);
router.get("/announcements", getAllAnnouncements);
router.delete("/announcements/:id", authMiddleware, adminOrManagerMiddleware, deleteAnnouncement);

// Notification Routes
router.get("/notifications", authMiddleware, getUserNotifications);
router.get("/notifications/unread-count", authMiddleware, getUnreadCount);
router.patch("/notifications/read-all", authMiddleware, markAllRead);
router.patch("/notifications/:id/read", authMiddleware, markAsRead);
router.post("/notifications/clear-all", authMiddleware, clearAllNotifications);
router.delete("/notifications/:id", authMiddleware, deleteNotification);

export default router;
