import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_HOST = "192.168.101.7";
const BASE_URL = `http://${API_HOST}:5000/api`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Ensure no stale token remains if AsyncStorage was cleared
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we get a 401/403, it means the session is definitely invalid
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // const failedUrl = error.config?.url;
      // console.warn(`[API] Session cleared due to ${error.response.status} on: ${failedUrl}`);
      await AsyncStorage.multiRemove([
        "userToken",
        "username",
        "userRole",
        "hasCompletedOnboarding",
      ]);
    }
    return Promise.reject(error);
  },
);

export const logoutUser = async () => {
  await AsyncStorage.multiRemove([
    "userToken",
    "username",
    "userRole",
    "hasCompletedOnboarding",
  ]);
  // Optional: Add any backend logout call here if exists
};

export const register = (userData) => {
  return api.post("/register", userData);
};

export const login = (userData) => {
  return api.post("/login", userData);
};

export const verifyOtp = (email, otp) => {
  return api.post("/verify-otp", { email, otp });
};

export const resendOtp = (email) => {
  return api.post("/resend-otp", { email });
};

export const forgotPassword = (email) => {
  return api.post("/forgot-password", { email });
};

export const resetPassword = (data) => {
  return api.post("/reset-password", data);
};

export const fetchArenas = () => {
  return api.get("/arenas");
};

export const fetchArenaSlots = (arenaId, date) => {
  return api.get(`/arenas/${arenaId}/slots`, { params: { date } });
};

export const createMatch = (matchData) => {
  return api.post("/matches", matchData);
};

export const fetchMatches = () => {
  return api.get("/matches");
};

export const fetchMyMatches = () => {
  return api.get("/matches/my");
};

export const updateProfilePicture = (profilePicture) => {
  return api.put("/users/profile", { profilePicture });
};

export const updateProfile = (profileData) => {
  return api.put("/users/profile", profileData);
};

export const fetchUserProfile = () => {
  return api.get("/users/profile");
};

// Match Details & Join
export const fetchMatchById = (matchId) => {
  return api.get(`/matches/${matchId}`);
};

export const joinMatch = (matchId) => {
  return api.post(`/matches/${matchId}/join`);
};

export const leaveMatch = (matchId) => {
  return api.delete(`/matches/${matchId}/leave`);
};

export const deleteMatch = (matchId) => {
  return api.delete(`/matches/${matchId}`);
};

// Team Operations
export const fetchTeams = () => {
  return api.get("/teams");
};

export const fetchMyTeams = () => {
  return api.get("/teams/my");
};

export const createTeam = (teamData) => {
  return api.post("/teams", teamData);
};

// Team Matchmaking
export const fetchTeamMatches = () => {
  return api.get("/team-matches");
};

export const fetchMyTeamMatches = () => {
  return api.get("/team-matches/my");
};

export const hostTeamMatch = (matchData) => {
  return api.post("/team-matches", matchData);
};

export const fetchTeamMatchById = (id) => {
  return api.get(`/team-matches/${id}`);
};

export const joinTeamMatchAsOpponent = (matchId, data) => {
  return api.post(`/team-matches/${matchId}/join`, data);
};

export const deleteTeamMatch = (id) => {
  return api.delete(`/team-matches/${id}`);
};

// Player Recruitment
export const fetchRecruitments = (params) => {
  return api.get("/recruitments", { params });
};

export const createRecruitment = (recruitmentData) => {
  return api.post("/recruitments", recruitmentData);
};

export const deleteRecruitment = (id) => {
  return api.delete(`/recruitments/${id}`);
};

// Recruitment Applications
export const applyToRecruitment = (recruitmentId) => {
  return api.post(`/recruitments/${recruitmentId}/apply`);
};

export const fetchMyApplications = () => {
  return api.get("/recruitments/applications/my");
};

export const fetchReceivedApplications = () => {
  return api.get("/recruitments/applications/received");
};

export const updateApplicationStatus = (id, status) => {
  return api.patch(`/recruitments/applications/${id}`, { status });
};

export const deleteApplication = (id) => {
  return api.delete(`/recruitments/applications/${id}`);
};

// Tournaments
export const fetchTournaments = () => {
  return api.get("/tournaments");
};

export const createTournament = (tournamentData) => {
  return api.post("/tournaments", tournamentData);
};

export const fetchTournamentById = (id) => {
  return api.get(`/tournaments/${id}`);
};

export const registerTournament = (id, data) => {
  return api.post(`/tournaments/${id}/register`, data);
};

export const fetchAnnouncements = () => {
  return api.get("/announcements");
};

// Notifications
export const fetchNotifications = () => api.get("/notifications");
export const fetchUnreadCount = () => api.get("/notifications/unread-count");
export const markNotificationRead = (id) =>
  api.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () =>
  api.patch("/notifications/read-all");
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
export const clearAllNotifications = () => api.post("/notifications/clear-all");

export default api;
