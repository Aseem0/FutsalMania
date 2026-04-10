import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchAnnouncements } from "../services/api";

export default function AnnouncementsScreen() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const res = await fetchAnnouncements();
      setAnnouncements(res.data.data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnnouncements();
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header */}
        <View className="bg-black/90 flex-row items-center px-4 py-4 border-b border-[#1F1F1F]">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-[#121212] border border-[#1F1F1F]"
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-xl font-outfit-bold text-white ml-4">Announcements</Text>
        </View>

        <ScrollView 
          className="flex-1 px-4 pt-6"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFB300" />
          }
        >
          {loading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator color="#FFB300" size="large" />
            </View>
          ) : announcements.length === 0 ? (
            <View className="py-20 items-center justify-center">
              <View className="h-20 w-20 rounded-full bg-[#121212] items-center justify-center mb-6">
                <MaterialCommunityIcons name="bullhorn-outline" size={40} color="rgba(255,255,255,0.1)" />
              </View>
              <Text className="text-white/40 font-inter-bold text-lg">No announcements today</Text>
              <Text className="text-white/20 font-inter-medium text-sm mt-2 text-center px-10">
                Stay tuned! Global updates and arena news will appear here.
              </Text>
            </View>
          ) : (
            announcements.map((item) => (
              <View 
                key={item.id} 
                className="bg-[#121212] border border-[#1F1F1F] rounded-2xl p-5 mb-5 overflow-hidden"
              >
                {/* Badge */}
                <View className="flex-row justify-between items-start mb-4">
                  <View className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30">
                    <Text className="text-[10px] font-inter-black text-amber-400 uppercase tracking-widest">
                      {item.author?.role === 'admin' ? 'OFFICIAL' : 'ARENA UPDATE'}
                    </Text>
                  </View>
                  <Text className="text-[11px] text-[#A1A1AA] font-inter-semibold">
                    {formatDate(item.createdAt)}
                  </Text>
                </View>

                <Text className="text-xl font-outfit-bold text-white mb-3">
                  {item.title}
                </Text>
                
                <Text className="text-[#A1A1AA] font-inter-medium text-[15px] leading-6 mb-6">
                  {item.content}
                </Text>

                {/* Footer */}
                <View className="pt-4 border-t border-white/5 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="h-6 w-6 rounded-full bg-amber-400/10 items-center justify-center mr-2">
                      <MaterialCommunityIcons name="account" size={14} color="#FFB300" />
                    </View>
                    <Text className="text-white/60 text-xs font-inter-bold">
                      {item.author?.username}
                    </Text>
                  </View>
                  
                  {item.arena && (
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="map-marker" size={12} color="#A1A1AA" className="mr-1" />
                      <Text className="text-[#A1A1AA] text-xs font-inter-medium">
                        {item.arena?.name}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
