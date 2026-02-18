import React, { useEffect, useState } from "react";
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
import { useRouter } from 'expo-router';
import { fetchMyMatches } from "../../services/api";

export default function HomeScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await fetchMyMatches();
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "TODAY";
    
    // Check if tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return "TOMORROW";

    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }).toUpperCase();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header */}
        <View className="bg-black/90 px-4 py-4 border-b border-[#1F1F1F]">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">
              <Text className="italic">FUTSAL</Text>
              <Text className="text-[#FFB300]">MANIA</Text>
            </Text>
            
            <View className="flex-row items-center gap-4">
              <TouchableOpacity className="relative">
                <MaterialCommunityIcons name="bell-outline" size={24} color="#ffffff" />
                <View className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#FFB300] border border-black" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.push("/(auth)/login")}
                className="h-8 w-8 rounded-full items-center justify-center border border-[#1F1F1F] bg-[#121212]"
              >
                <MaterialCommunityIcons name="chevron-left" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView className="flex-1 pb-32" showsVerticalScrollIndicator={false}>
          {/* Welcome */}
          <View className="px-5 pt-8 pb-6">
            <Text className="text-3xl font-bold text-white">
              Welcome back, User!
            </Text>
            <Text className="text-[#A1A1AA] mt-1 text-sm">
              Elevate your performance today
            </Text>
          </View>

          {/* Grid Cards */}
          <View className="px-5">
            <View className="flex-row gap-3 mb-3">
              <TouchableOpacity 
                onPress={() => router.push('/host-game')}
                className="flex-1 flex-col gap-3 rounded-xl border border-[#1F1F1F] bg-[#121212] p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons name="plus-circle-outline" size={32} color="#FFB300" />
                <View>
                  <Text className="font-semibold text-base text-white">Host Game</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-bold">
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
                  <Text className="font-semibold text-base text-white">Find Game</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-bold">
                    DISCOVER
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity 
                className="flex-1 flex-col gap-3 rounded-xl border border-[#1F1F1F] bg-[#121212] p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons name="account-group-outline" size={32} color="#ffffff" />
                <View>
                  <Text className="font-semibold text-base text-white">Find Players</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-bold">
                    SCOUT
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-1 flex-col gap-3 rounded-xl border border-[#1F1F1F] bg-[#121212] p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons name="trophy-outline" size={32} color="#ffffff" />
                <View>
                  <Text className="font-semibold text-base text-white">Tournaments</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-bold">
                    CHAMPIONSHIP
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sessions */}
          <View className="mt-10">
            <View className="flex-row items-center justify-between px-5 mb-4">
              <Text className="text-lg font-bold text-white">Your Activities</Text>
              <TouchableOpacity onPress={() => router.push('/(matches)/all-activity')}>
                <Text className="text-xs font-semibold text-[#FFB300] uppercase tracking-wider">
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
                  <Text className="text-white/40 mt-4 font-bold">No sessions scheduled yet</Text>
                  <TouchableOpacity 
                    onPress={() => router.push('/host-game')}
                    className="mt-6 bg-amber-400 px-6 py-2 rounded-lg"
                  >
                    <Text className="text-black font-black text-xs">HOST NOW</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                matches.slice(0, 2).map((match) => (
                  <TouchableOpacity 
                    key={match.id} 
                    activeOpacity={0.9}
                    onPress={() => router.push({
                      pathname: "/(matches)/match-details",
                      params: { id: match.id }
                    })}
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
                          <Text className="font-bold text-lg text-white" numberOfLines={1}>
                            {match.arena?.name || "Premium Futsal"}
                          </Text>
                          <Text className="text-xs text-white/80 font-medium" numberOfLines={1}>
                            {match.arena?.location || "Kathmandu"} • Hosted by {match.host?.username || "Player"}
                          </Text>
                        </View>
                        <View className="px-2 py-1 rounded border border-[#1F1F1F] bg-black/60">
                          <Text className="text-[10px] font-bold text-white">{formatDate(match.date)}</Text>
                        </View>
                      </View>

                      <View className="gap-4">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-2">
                            <MaterialCommunityIcons name="clock-outline" size={16} color="#FFB300" />
                            <Text className="text-sm text-white font-semibold">{match.time}</Text>
                          </View>
                          <View className="px-2 py-0.5 rounded-full bg-amber-400/20">
                            <Text className="text-[10px] font-black text-amber-400 uppercase tracking-tighter">
                              {match.format} • {match.skillLevel}
                            </Text>
                          </View>
                        </View>

                        <View className="gap-2">
                          <View className="flex-row justify-between">
                            <Text className="text-[11px] font-bold uppercase text-white/70">
                              JOINED SQUAD
                            </Text>
                            <Text className="text-[11px] font-bold uppercase text-[#FFB300]">
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
