import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { fetchMyMatches, fetchMyApplications, fetchReceivedApplications, fetchUserProfile } from "../../services/api";
import { formatDate } from "../../utils/dateUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotifications } from "../../context/NotificationContext";
import HostChoiceModal from "../../components/HostChoiceModal";

export default function HomeScreen() {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const [matches, setMatches] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [receivedApplications, setReceivedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("User");
  const [isHostModalVisible, setIsHostModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("Home: No token found. Skipping fetch.");
        return;
      }

      // Pre-load username from storage for instant UI
      const storedName = await AsyncStorage.getItem("username");
      if (storedName) setUsername(storedName);

      setLoading(true);
      
      const fetchAndLog = async (name, promise) => {
        try {
          const res = await promise;
          console.log(`[Home] ${name} loaded successfully.`);
          return res;
        } catch (err) {
          console.error(`[Home] Error fetching ${name}:`, err.response?.status || err.message);
          return { data: [] }; // Fallback to empty data to avoid crashing the whole screen
        }
      };

      const [matchesRes, myAppsRes, receivedAppsRes, profileRes] = await Promise.all([
        fetchAndLog("Matches", fetchMyMatches()),
        fetchAndLog("MyApplications", fetchMyApplications()),
        fetchAndLog("ReceivedApplications", fetchReceivedApplications()),
        fetchAndLog("UserProfile", fetchUserProfile()),
      ]);

      setMatches(matchesRes.data || []);
      setMyApplications(myAppsRes.data || []);
      setReceivedApplications(receivedAppsRes.data || []);
      
      if (profileRes.data?.username) {
        setUsername(profileRes.data.username);
        await AsyncStorage.setItem("username", profileRes.data.username);
      }
    } catch (error) {
      // Don't show connectivity error if it's an authentication error (user might be logging out)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log("Home: Authentication error during fetch. User likely logged out.");
        return;
      }
      
      console.error("Error fetching home data:", error);
      alert("Connectivity Error: Could not connect to the server. Please check your network or if the backend is running.");
    } finally {
      if (loading) setLoading(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header */}
        <View className="bg-black/90 px-4 py-4 border-b border-[#1F1F1F]">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-outfit-bold text-white">
              <Text className="italic">FUTSAL</Text>
              <Text className="text-[#FFB300]">MANIA</Text>
            </Text>
            
            <View className="flex-row items-center gap-4">
              <TouchableOpacity 
                onPress={() => router.push("/announcements")}
                className="relative"
              >
                <MaterialCommunityIcons name="bullhorn-outline" size={24} color="#ffffff" />
              </TouchableOpacity>

              <TouchableOpacity
                className="relative"
                onPress={() => router.push("/notifications")}
              >
                <MaterialCommunityIcons name="bell-outline" size={24} color="#ffffff" />
                {unreadCount > 0 && (
                  <View
                    className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-[#FFB300] border border-black items-center justify-center px-0.5"
                  >
                    <Text className="text-black text-[9px] font-inter-black leading-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome */}
          <View className="px-5 pt-8 pb-6">
            <Text className="text-3xl font-outfit-bold text-white">
              Welcome back, {username}!
            </Text>
            <Text className="text-[#A1A1AA] mt-1 text-sm font-inter-medium">
              Elevate your performance today
            </Text>
          </View>

          {/* Grid Cards */}
          <View className="px-5">
            <View className="flex-row gap-3 mb-3">
              <TouchableOpacity 
                onPress={() => setIsHostModalVisible(true)}
                className="flex-1 flex-col gap-3 rounded-xl border border-[#1F1F1F] bg-[#121212] p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons name="plus-circle-outline" size={32} color="#FFB300" />
                <View>
                  <Text className="font-inter-semibold text-base text-white">Host Game</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-inter-bold">
                    INITIATE
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/explore')}
                className="flex-1 flex-col gap-3 rounded-xl border border-[#1F1F1F] bg-[#121212] p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons name="magnify" size={32} color="#ffffff" />
                <View>
                  <Text className="font-inter-semibold text-base text-white">Find Game</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-inter-bold">
                    DISCOVER
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={() => router.push({
                  pathname: '/explore',
                  params: { tab: 'PLAYERS' }
                })}
                className="flex-1 flex-col gap-3 rounded-xl border border-[#1F1F1F] bg-[#121212] p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons name="account-group-outline" size={32} color="#ffffff" />
                <View>
                  <Text className="font-inter-semibold text-base text-white">Find Players</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-inter-bold">
                    SCOUT
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/tournaments')}
                className="flex-1 flex-col gap-3 rounded-xl border border-[#1F1F1F] bg-[#121212] p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons name="trophy-outline" size={32} color="#ffffff" />
                <View>
                  <Text className="font-inter-semibold text-base text-white">Tournaments</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-inter-bold">
                    CHAMPIONSHIP
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sessions */}
          <View className="mt-10">
            <View className="flex-row items-center justify-between px-5 mb-4">
              <Text className="text-lg font-outfit-bold text-white">Your Activities</Text>
              <TouchableOpacity onPress={() => router.push('/(matches)/all-activity')}>
                <Text className="text-xs font-inter-bold text-[#FFB300] uppercase tracking-wider">
                  ALL ACTIVITY
                </Text>
              </TouchableOpacity>
            </View>

            <View className="px-5 gap-4 pb-10">
              {loading && matches.length === 0 ? (
                <View className="py-20 items-center justify-center">
                  <ActivityIndicator color="#FFB300" />
                </View>
              ) : matches.length === 0 ? (
                <View className="py-20 items-center justify-center border border-[#1F1F1F] rounded-xl bg-[#111]">
                  <MaterialCommunityIcons name="soccer-field" size={48} color="rgba(255,255,255,0.1)" />
                  <Text className="text-white/40 mt-4 font-inter-bold">No sessions scheduled yet</Text>
                  <TouchableOpacity 
                    onPress={() => setIsHostModalVisible(true)}
                    className="mt-6 bg-amber-400 px-6 py-2 rounded-lg"
                  >
                    <Text className="text-black font-inter-black text-xs">HOST NOW</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                matches.slice(0, 2).map((match) => (
                  <TouchableOpacity 
                    key={match.id} 
                    activeOpacity={0.9}
                    onPress={() => {
                      if (!isNaN(match.id)) {
                        router.push({
                          pathname: "/(matches)/match-details",
                          params: { id: match.id }
                        });
                      }
                    }}
                    className="relative w-full h-56 rounded-xl overflow-hidden border border-[#1F1F1F]"
                  >
                    <Image
                      source={{ uri: match.arena?.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop' }}
                      className="absolute inset-0 w-full h-full"
                      resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/60" />
                    
                    <View className="relative h-full flex-col justify-between p-5">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 mr-2">
                          <Text className="font-outfit-bold text-lg text-white" numberOfLines={1}>
                            {match.arena?.name || "Premium Futsal"}
                          </Text>
                          <Text className="text-xs text-white/80 font-inter-medium" numberOfLines={1}>
                            {match.arena?.location || "Kathmandu"} • Hosted by {match.host?.username || "Player"}
                          </Text>
                        </View>
                        <View className="px-2 py-1 rounded border border-[#1F1F1F] bg-black/60">
                          <Text className="text-[10px] font-inter-bold text-white">{formatDate(match.date)}</Text>
                        </View>
                      </View>

                      <View className="gap-4">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-2">
                            <MaterialCommunityIcons name="clock-outline" size={16} color="#FFB300" />
                            <Text className="text-sm text-white font-inter-semibold">{match.time}</Text>
                          </View>
                          <View className="px-2 py-0.5 rounded-full bg-amber-400/20">
                            <Text className="text-[10px] font-inter-black text-amber-400 uppercase tracking-tighter">
                              {match.format} • {match.skillLevel}
                            </Text>
                          </View>
                        </View>

                        <View className="gap-2">
                          <View className="flex-row justify-between">
                            <Text className="text-[11px] font-inter-bold uppercase text-white/70">
                              JOINED SQUAD
                            </Text>
                            <Text className="text-[11px] font-inter-bold uppercase text-[#FFB300]">
                              {match.currentPlayers}/{match.maxPlayers}
                            </Text>
                          </View>
                          <View className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <View 
                              className="bg-[#FFB300] h-full" 
                              style={{ width: `${(match.currentPlayers / match.maxPlayers) * 100}%` }} 
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>


          {/* Recruitment Hub Navigation Card */}
          {(myApplications.length > 0 || receivedApplications.length > 0) && (
            <View className="px-5 mt-8">
              <TouchableOpacity 
                activeOpacity={0.95}
                onPress={() => router.push('/(profile)/recruitment-hub')}
                className="bg-[#121212] border border-[#1f1f1f] rounded-[24px] p-5 flex-row items-center justify-between"
                style={{
                  elevation: 4,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-2xl bg-amber-400/10 items-center justify-center border border-amber-400/20">
                    <MaterialCommunityIcons name="folder-account" size={24} color="#FFB300" />
                  </View>
                  <View>
                    <Text className="text-white font-outfit-bold text-lg leading-tight uppercase italic">Recruitment Hub</Text>
                    <View className="flex-row items-center gap-3 mt-1">
                      <View className="bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        <Text className="text-amber-400 text-[8px] font-inter-black uppercase tracking-widest">
                          {myApplications.length + receivedApplications.length} TOTAL ACTIONS
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#FFB300" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      <HostChoiceModal 
        visible={isHostModalVisible} 
        onClose={() => setIsHostModalVisible(false)} 
      />
    </SafeAreaView>
  );
}
