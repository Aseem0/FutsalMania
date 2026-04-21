import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchMyMatches, fetchMyTeamMatches } from "../../services/api";

export default function AllActivityScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const [soloRes, teamRes] = await Promise.all([
        fetchMyMatches(),
        fetchMyTeamMatches()
      ]);

      // Tag and merge
      const soloMatches = (soloRes.data || []).map(m => ({ ...m, type: 'solo' }));
      const teamMatches = (teamRes.data || []).map(m => ({ ...m, type: 'team' }));

      const all = [...soloMatches, ...teamMatches];

      // Sort by date and then time
      all.sort((a, b) => {
        if (a.date !== b.date) {
          return new Date(a.date) - new Date(b.date);
        }
        return a.time.localeCompare(b.time);
      });

      setActivities(all);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "TODAY";

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return "TOMORROW";

    return date
      .toLocaleDateString("en-US", { weekday: "short", day: "numeric" })
      .toUpperCase();
  };

  const renderSoloCard = (match) => (
    <TouchableOpacity
      key={`solo-${match.id}`}
      activeOpacity={0.9}
      onPress={() => router.push({
        pathname: "/(matches)/match-details",
        params: { id: match.id }
      })}
      className="relative w-full h-64 rounded-3xl overflow-hidden border border-white/5 shadow-2xl mb-6"
    >
      <Image
        source={{
          uri: match.arena?.image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
        }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/60" />

      <View className="relative h-full flex-col justify-between p-6">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-4">
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="place" size={12} color="#fbbf24" />
              <Text className="text-amber-400 text-[10px] font-black uppercase tracking-widest ml-1" numberOfLines={1}>
                {match.arena?.location || "Kathmandu"}
              </Text>
            </View>
            <Text className="font-black text-2xl text-white leading-none" numberOfLines={1}>
              {match.arena?.name || "Premium Futsal"}
            </Text>
            <Text className="text-xs text-white/50 font-bold mt-1" numberOfLines={1}>
              Hosted by {match.host?.username || "Player"}
            </Text>
          </View>
          <View className="px-3 py-1.5 rounded-xl border border-white/10 bg-black/80">
            <Text className="text-[10px] font-black text-white tracking-widest">
              {formatDate(match.date)}
            </Text>
          </View>
        </View>

        <View className="gap-4">
          <View className="flex-row items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="clock-outline" size={18} color="#FFB300" />
              <Text className="text-md text-white font-black tracking-tight">{match.time}</Text>
            </View>
            <View className="bg-amber-400 px-3 py-1 rounded-full">
              <Text className="text-[10px] font-black text-black uppercase">{match.format}</Text>
            </View>
          </View>
          <View className="gap-2">
            <View className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <View
                className="bg-amber-400 h-full rounded-full"
                style={{ width: `${(match.currentPlayers / match.maxPlayers) * 100}%` }}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTeamCard = (match) => {
    const hostName = match.hostTeam?.name || match.customTeamName || "Squad Alpha";
    const guestName = match.guestTeam?.name || match.guestCustomTeamName || "Challenger";

    return (
      <TouchableOpacity
        key={`team-${match.id}`}
        activeOpacity={0.9}
        onPress={() => router.push({
          pathname: "/(matches)/team-match-details",
          params: { id: match.id }
        })}
        className="relative w-full h-64 rounded-3xl overflow-hidden border border-white/5 shadow-2xl mb-6"
      >
        <Image
          source={{
            uri: match.arena?.image || "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800&auto=format&fit=crop",
          }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/75" />

        <View className="relative h-full flex-col justify-between p-5">
           <View className="flex-row justify-between items-center">
              <View className="px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20">
                <Text className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Team vs Team</Text>
              </View>
              <View className="px-3 py-1.5 rounded-xl border border-white/10 bg-black/80">
                <Text className="text-[10px] font-black text-white tracking-widest">{formatDate(match.date)}</Text>
              </View>
           </View>

           {/* Matchup View */}
           <View className="flex-row items-center justify-around py-2">
              <View className="items-center flex-1">
                 <View className="w-12 h-12 bg-white/5 rounded-full items-center justify-center border border-white/10 mb-2">
                    <FontAwesome5 name="shield-alt" size={20} color="#fbbf24" />
                 </View>
                 <Text className="text-white font-black text-[10px] uppercase text-center" numberOfLines={1}>{hostName}</Text>
              </View>
              
              <Text className="text-amber-400 text-xl font-black italic mx-4">VS</Text>
              
              <View className="items-center flex-1">
                 <View className="w-12 h-12 bg-white/5 rounded-full items-center justify-center border border-white/10 mb-2">
                    <FontAwesome5 name="shield-alt" size={20} color={match.guestId ? "#fbbf24" : "#333"} />
                 </View>
                 <Text className="text-white font-black text-[10px] uppercase text-center" numberOfLines={1}>{guestName}</Text>
              </View>
           </View>

           <View className="flex-row items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="place" size={14} color="#fbbf24" />
                <Text className="text-xs text-white font-black" numberOfLines={1}>{match.arena?.name || "The Arena"}</Text>
              </View>
              <View className="flex-row items-center gap-4">
                 <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#fbbf24" />
                    <Text className="text-[11px] text-white font-bold">{match.time}</Text>
                 </View>
                 <View className="bg-white/10 px-3 py-1 rounded-full">
                    <Text className="text-[9px] font-black text-white uppercase">{match.format}</Text>
                 </View>
              </View>
           </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <View className="flex-1 max-w-md mx-auto w-full border-x border-white/5">
        {/* Header */}
        <View className="px-6 pt-6 pb-6 bg-black border-b border-white/5">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-[#111] border border-white/5"
            >
              <MaterialIcons name="chevron-left" size={24} color="#ffffff" />
            </TouchableOpacity>

            <Text className="text-xl font-black uppercase tracking-tight text-white">
              My Activities
            </Text>

            <TouchableOpacity
              onPress={loadActivities}
              className="w-10 h-10 items-center justify-center rounded-full bg-[#111] border border-white/5"
            >
              <MaterialCommunityIcons
                name="refresh"
                size={20}
                color={loading ? "rgba(255,255,255,0.2)" : "#fbbf24"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-5 pt-6"
          showsVerticalScrollIndicator={false}
        >
          {loading && activities.length === 0 ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator color="#FFB300" />
              <Text className="text-white/40 mt-4 font-bold">
                Fetching sessions...
              </Text>
            </View>
          ) : activities.length === 0 ? (
            <View className="py-20 items-center justify-center border border-[#1F1F1F] rounded-2xl bg-[#111] px-10">
              <MaterialCommunityIcons
                name="soccer-field"
                size={64}
                color="rgba(255,255,255,0.05)"
              />
              <Text className="text-white/60 mt-6 font-bold text-center">
                You haven't hosted or joined any games yet.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/host-game")}
                className="mt-8 bg-amber-400 px-10 py-4 rounded-2xl"
              >
                <Text className="text-black font-black uppercase tracking-widest text-sm">
                  Host Game
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="pb-20">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[3px] ml-1 mb-6">
                Your Upcoming Sessions
              </Text>

              {activities.map((item) => (
                item.type === 'team' ? renderTeamCard(item) : renderSoloCard(item)
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
