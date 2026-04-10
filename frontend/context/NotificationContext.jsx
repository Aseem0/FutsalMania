import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUnreadCount } from "../services/api";

const NotificationContext = createContext({ unreadCount: 0, refreshCount: () => {} });

export const useNotifications = () => useContext(NotificationContext);

const POLL_INTERVAL_MS = 45000; // Poll every 45 seconds

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  const refreshCount = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setUnreadCount(0);
        return;
      }
      const res = await fetchUnreadCount();
      setUnreadCount(res.data?.count ?? 0);
    } catch {
      // Silently fail — don't crash the app for a badge count
    }
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // Already running
    refreshCount();
    intervalRef.current = setInterval(refreshCount, POLL_INTERVAL_MS);
  }, [refreshCount]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startPolling();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === "active") {
        // App came to foreground — resume polling immediately
        startPolling();
      } else if (nextState.match(/inactive|background/)) {
        // App went to background — pause polling to save battery
        stopPolling();
      }
      appStateRef.current = nextState;
    });

    return () => {
      stopPolling();
      subscription.remove();
    };
  }, [startPolling, stopPolling]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshCount }}>
      {children}
    </NotificationContext.Provider>
  );
}
