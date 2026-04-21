import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { fetchTeamMatches, joinTeamMatchAsOpponent, fetchMyTeams } from "../../services/api";
import { formatDate } from "../../utils/dateUtils";

const ChallengeCard = ({ match, router }) => {
  const { hostTeam, customTeamName, arena, date, time, format, host } = match;
  const teamName = customTeamName || hostTeam?.name || "Open Challenge";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push({
        pathname: "/(matches)/team-match-details",
        params: { id: match.id }
      })}
      className="relative w-full h-48 rounded-3xl overflow-hidden border border-white/5"
    >
      <Image
        source={{ uri: arena?.image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop" }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/60" />
      <View className="p-4 justify-between h-full">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-white text-2xl font-black">{teamName}</Text>
            <Text className="text-white/50 text-xs font-bold">vs ??? • {host?.username || "Player"}</Text>
          </View>
          <View className="bg-black/80 px-3 py-1.5 rounded-xl border border-white/10">
            <Text className="text-white text-[10px] font-black uppercase tracking-widest">
              {formatDate(date)}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="clock-outline" size={18} color="#FFB300" />
            <Text className="text-white font-black">{time}</Text>
          </View>
          <View className="bg-amber-400 px-3 py-1 rounded-full">
            <Text className="text-black text-[10px] font-black uppercase">{format} • Team Match</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TeamsTab = () => {
  const router = useRouter();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadChallenges = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await fetchTeamMatches();
      const openMatches = response.data.filter(m => m.status === 'open');
      setMatches(openMatches);
    } catch (error) {
      console.error("Error fetching team challenges:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const onRefresh = () => {
    setRefreshing(true);
    loadChallenges(false);
  };

  const handleChallenge = async (matchId, opponentName) => {
    try {
      setSubmitting(true);
      const teamRes = await fetchMyTeams();
      const myTeams = teamRes.data;

      if (!myTeams || myTeams.length === 0) {
        Alert.alert("Squad Required", "You must be a member or captain of a team to accept a challenge.", [{ text: "OK" }]);
        return;
      }

      const myTeam = myTeams[0];
      Alert.alert(
        "Confirm Challenge",
        `Challenge ${opponentName} using ${myTeam.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "SEND CHALLENGE",
            onPress: async () => {
              try {
                await joinTeamMatchAsOpponent(matchId, myTeam.id);
                Alert.alert("Success", "Match scheduled! Prepare your squad. ⚽");
                loadChallenges();
              } catch (err) {
                Alert.alert("Failed", err.response?.data?.message || "Could not accept challenge.");
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Challenge error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {submitting && (
        <View className="absolute inset-0 bg-black/60 z-50 items-center justify-center">
          <ActivityIndicator color="#fbbf24" size="large" />
        </View>
      )}

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbbf24" />
        }
      >
        {loading ? (
          <ActivityIndicator color="#FFB300" className="mt-10" />
        ) : (
          <View className="gap-6 pb-44">
            {matches.length > 0 ? (
              matches.map(item => (
                <ChallengeCard
                  key={item.id}
                  match={item}
                  router={router}
                />
              ))
            ) : (
              <View className="items-center justify-center mt-20">
                <FontAwesome5 name="handshake" size={48} color="#3f3f46" />
                <Text className="text-[#A1A1AA] font-bold mt-4 text-center">No active challenges found</Text>
                <TouchableOpacity onPress={() => loadChallenges()} className="mt-4">
                  <Text className="text-amber-400 font-black uppercase text-[10px] tracking-widest">Refresh List</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default TeamsTab;
