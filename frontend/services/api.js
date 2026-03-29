import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";


const API_HOST = "192.168.101.13"; 
const BASE_URL = `http://${API_HOST}:5000/api`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});


api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (userData) => {
  return api.post("/register", userData);
};

export const login = (userData) => {
  return api.post("/login", userData);
};

export const fetchArenas = () => {
  return api.get("/arenas");
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

export const hostTeamMatch = (matchData) => {
  return api.post("/team-matches", matchData);
};

export const fetchTeamMatchById = (id) => {
  return api.get(`/team-matches/${id}`);
};

export const joinTeamMatchAsOpponent = (matchId, teamId) => {
  return api.post(`/team-matches/${matchId}/join`, { teamId });
};

// Player Recruitment
export const fetchRecruitments = (params) => {
  return api.get("/recruitments", { params });
};

export const createRecruitment = (recruitmentData) => {
  return api.post("/recruitments", recruitmentData);
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

export default api;
