import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.101.4:5000/api";

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

export default api;
