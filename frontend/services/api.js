import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const BASE_URL = "http://192.168.101.5:5000/api"; // Home IP
const BASE_URL = "http://100.64.209.44:5000/api"; // College IP

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// This automatically attaches your Login Token to every request
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

// Team Matchmaking
export const fetchTeamMatches = () => {
  return api.get("/team-matches");
};

export const hostTeamMatch = (matchData) => {
  return api.post("/team-matches", matchData);
};

export const joinTeamMatchAsOpponent = (matchId, teamId) => {
  return api.post(`/team-matches/${matchId}/join`, { teamId });
};

export default api;
