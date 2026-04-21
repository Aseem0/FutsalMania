import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  fetchNotifications,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "../services/api";
import { useNotifications } from "../context/NotificationContext";
import { Alert } from "react-native";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

const ICON_MAP = {
  match_join: { name: "soccer", color: "#FFB300" },
  match_full: { name: "check-circle", color: "#22c55e" },
  game_reminder: { name: "clock-alert-outline", color: "#f97316" },
  booking_confirmed: { name: "calendar-check", color: "#22c55e" },
  booking_cancelled: { name: "calendar-remove", color: "#ef4444" },
  announcement: { name: "bullhorn", color: "#a78bfa" },
  recruitment_apply: { name: "account-plus", color: "#38bdf8" },
};

const TYPE_LABELS = {
  match_join: "Match",
  match_full: "Match",
  game_reminder: "Reminder",
  booking_confirmed: "Booking",
  booking_cancelled: "Booking",
  announcement: "Announcement",
  recruitment_apply: "Recruitment",
};

function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const diffS = Math.floor((now - then) / 1000);
  if (diffS < 60) return "Just now";
  if (diffS < 3600) return `${Math.floor(diffS / 60)}m ago`;
  if (diffS < 86400) return `${Math.floor(diffS / 3600)}h ago`;
  const days = Math.floor(diffS / 86400);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

// ────────────────────────────────────────────────────────────────
// Notification Card
// ────────────────────────────────────────────────────────────────

function NotificationCard({ item }) {
  const icon = ICON_MAP[item.type] || { name: "bell", color: "#FFB300" };
  const label = TYPE_LABELS[item.type] || "Notification";

  return (
    <View
      className="flex-row items-start px-4 py-4"
      style={{
        borderLeftWidth: item.isRead ? 0 : 3,
        borderLeftColor: "#FFB300",
        backgroundColor: item.isRead ? "transparent" : "rgba(255, 179, 0, 0.04)",
      }}
    >
      {/* Icon bubble */}
      <View
        className="w-11 h-11 rounded-full items-center justify-center mr-4 flex-shrink-0"
        style={{ backgroundColor: `${icon.color}18` }}
      >
        <MaterialCommunityIcons name={icon.name} size={22} color={icon.color} />
      </View>

      {/* Text */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-0.5">
          <Text
            className="text-[10px] font-inter-bold uppercase tracking-widest"
            style={{ color: icon.color }}
          >
            {label}
          </Text>
          <Text className="text-[10px] font-inter-medium text-white/30">
            {timeAgo(item.createdAt)}
          </Text>
        </View>
        <Text
          className="font-inter-bold text-sm mb-1"
          style={{ color: item.isRead ? "#A1A1AA" : "#ffffff" }}
        >
          {item.title}
        </Text>
        <Text className="text-[#71717a] text-xs font-inter-medium leading-relaxed">
          {item.body}
        </Text>
      </View>
    </View>
  );
}

// ────────────────────────────────────────────────────────────────
// Separator
// ────────────────────────────────────────────────────────────────

function Separator() {
  return <View className="h-px mx-4 bg-[#1F1F1F]" />;
}

// ────────────────────────────────────────────────────────────────
// Empty State
// ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center py-32 px-8">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: "rgba(255,179,0,0.08)" }}
      >
        <MaterialCommunityIcons name="bell-sleep-outline" size={40} color="#FFB300" />
      </View>
      <Text className="text-white font-outfit-bold text-xl mb-2">All caught up!</Text>
      <Text className="text-[#71717a] font-inter-medium text-sm text-center leading-relaxed">
        You have no notifications yet. Join a match or book an arena to get started.
      </Text>
    </View>
  );
}

// ────────────────────────────────────────────────────────────────
// Main Screen
// ────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const router = useRouter();
  const { refreshCount, clearBadge } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await fetchNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // On mount: load notifications, mark all as read, reset badge
  useEffect(() => {
    loadNotifications();
    if (clearBadge) clearBadge();
    markAllNotificationsRead()
      .then(() => refreshCount())
      .catch(() => {});
  }, [loadNotifications, refreshCount, clearBadge]);

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">

        {/* ── Header ── */}
        <View className="px-4 py-4 border-b border-[#1F1F1F] flex-row items-center justify-between bg-black/90">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} className="mr-1">
              <MaterialCommunityIcons name="arrow-left" size={22} color="#ffffff" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-outfit-bold text-white">Notifications</Text>
              {unreadCount > 0 && (
                <Text className="text-[10px] font-inter-bold text-[#FFB300] uppercase tracking-widest">
                  {unreadCount} unread
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={async () => {
                try {
                  if (clearBadge) clearBadge(); // Optimistic UI update
                  setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                  await markAllNotificationsRead();
                  refreshCount();
                } catch (err) {
                  console.error("Failed to mark all as read:", err.message);
                }
              }}
            >
              <Text className="text-[10px] font-inter-bold text-[#FFB300] uppercase tracking-wider">
                Mark all read
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Clear All",
                  "Are you sure you want to clear all notifications?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Clear All",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          // Visual transition
                          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                          setNotifications([]);
                          
                          const response = await clearAllNotifications();
                          if (response.status >= 200 && response.status < 300) {
                            if (clearBadge) clearBadge();
                            refreshCount();
                          } else {
                            throw new Error("Server error");
                          }
                        } catch (err) {
                          console.error("Clear notifications error:", err.message);
                          Alert.alert("Error", "Could not clear on the server. Please try again.");
                          loadNotifications(); // Restore list
                        }
                      },
                    },
                  ],
                  { cancelable: true }
                );
              }}
              activeOpacity={0.6}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Content ── */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#FFB300" size="large" />
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <NotificationCard item={item} />
            )}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={EmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FFB300"
                colors={["#FFB300"]}
              />
            }
            contentContainerStyle={notifications.length === 0 ? { flex: 1 } : { paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
