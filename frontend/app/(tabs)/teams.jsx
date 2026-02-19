import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  fetchTeamMatches,
  fetchMyTeams,
  createTeam,
  hostTeamMatch,
  joinTeamMatchAsOpponent,
  fetchArenas,
} from "../../services/api";

export default function TeamsScreen() {
  const [matches, setMatches] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [arenas, setArenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals state
  const [showHostModal, setShowHostModal] = useState(false);

  // Form states
  const [matchForm, setMatchForm] = useState({
    teamId: "",
    arenaId: "",
    date: "",
    time: "",
    format: "5v5",
    price: "",
  });

  useEffect(() => {
    loadData();
    loadArenas();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [matchesRes, teamsRes] = await Promise.all([
        fetchTeamMatches(),
        fetchMyTeams(),
      ]);
      setMatches(matchesRes.data);
      setMyTeams(teamsRes.data);
    } catch (error) {
      console.error("Error loading teams data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadArenas = async () => {
    try {
      const res = await fetchArenas();
      setArenas(res.data);
    } catch (error) {
      console.error("Error fetching arenas:", error);
    }
  };

  const handleHostMatch = async () => {
    if (
      !matchForm.teamId ||
      !matchForm.arenaId ||
      !matchForm.date ||
      !matchForm.time
    ) {
      return Alert.alert("Error", "Please fill all required fields");
    }
    try {
      setSubmitting(true);
      await hostTeamMatch(matchForm);
      Alert.alert("Success", "Team match hosted! Waiting for opponents.");
      setShowHostModal(false);
      loadData();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to host match",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChallenge = async (matchId) => {
    if (myTeams.length === 0)
      return Alert.alert("Error", "You need a team to challenge others!");

    // For simplicity, if user has multiple teams, pick the first one or ask (here we pick first)
    const teamId = myTeams[0].id;

    Alert.alert(
      "Confirm Challenge",
      `Challenge this team using ${myTeams[0].name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "CHALLENGE",
          onPress: async () => {
            try {
              setLoading(true);
              await joinTeamMatchAsOpponent(matchId, teamId);
              Alert.alert("Match Scheduled!", "See you on the pitch. ⚽");
              loadData();
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to join match",
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", { day: "numeric", month: "short" })
      .toUpperCase();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header */}
        <View className="bg-black/90 px-5 py-6 border-b border-[#1F1F1F]">
          <Text className="text-3xl font-black text-white uppercase tracking-tighter">
            Matchmaking
          </Text>
          <Text className="text-[#A1A1AA] mt-1 text-sm font-medium">
            Find Opponents & Manage Team Matches
          </Text>
        </View>

        <ScrollView
          className="flex-1 pb-32"
          showsVerticalScrollIndicator={false}
        >
          {/* Host Match CTA */}
          <View className="px-5 pt-8 mb-8">
            <TouchableOpacity
              onPress={() => {
                if (myTeams.length === 0)
                  return Alert.alert(
                    "No Team Found",
                    "You must be a member of a team to host matches.",
                  );
                setShowHostModal(true);
              }}
              className="w-full bg-amber-400 h-20 rounded-3xl flex-row items-center justify-center border border-amber-500 shadow-xl"
              activeOpacity={0.9}
            >
              <FontAwesome5 name="fist-raised" size={24} color="black" />
              <Text className="text-black font-black text-lg ml-3 uppercase tracking-widest">
                Host Team Match
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section: Your Teams */}
          {/* <View className="mb-8 px-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px]">My Teams</Text>
              <Text className="text-amber-400 text-[10px] font-black uppercase">{myTeams.length}</Text>
            </View>
            
            {myTeams.length === 0 ? (
              <View className="bg-[#111] p-10 rounded-3xl border border-white/5 items-center justify-center">
                <MaterialCommunityIcons name="shield-outline" size={32} color="rgba(255,255,255,0.05)" />
                <Text className="text-white/20 mt-3 font-bold text-xs text-center line-through">No Squads Registered</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                {myTeams.map((team) => (
                  <TouchableOpacity 
                    key={team.id}
                    className="bg-[#111] w-40 rounded-2xl border border-white/5 p-4 mr-3"
                  >
                    <View className="h-10 w-10 bg-amber-400/10 rounded-xl items-center justify-center mb-3">
                      <FontAwesome5 name="shield-alt" size={20} color="#fbbf24" />
                    </View>
                    <Text className="text-white font-black text-sm truncate" numberOfLines={1}>{team.name}</Text>
                    <Text className="text-white/40 text-[8px] font-bold mt-1 uppercase italic">Captain</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View> */}

          {/* Section: Available Opponents (Matchmaking) */}
          <View className="mb-10 px-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px]">
                Find Opponents
              </Text>
              <TouchableOpacity onPress={loadData}>
                <MaterialIcons name="refresh" size={16} color="#fbbf24" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator color="#fbbf24" />
            ) : matches.length === 0 ? (
              <View className="bg-[#111] p-12 rounded-3xl border border-white/5 items-center justify-center">
                <FontAwesome5
                  name="handshake"
                  size={40}
                  color="rgba(255,255,255,0.05)"
                />
                <Text className="text-white/20 mt-4 font-bold text-center">
                  No teams hosting matches right now
                </Text>
              </View>
            ) : (
              <View className="gap-4">
                {matches.map((match) => (
                  <TouchableOpacity
                    key={match.id}
                    className="bg-[#111] p-5 rounded-3xl border border-white/10"
                    activeOpacity={0.9}
                  >
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-row items-center gap-3">
                        <View className="h-10 w-10 rounded-full bg-white/5 items-center justify-center border border-white/10">
                          <FontAwesome5
                            name="shield-alt"
                            size={18}
                            color="#fbbf24"
                          />
                        </View>
                        <View>
                          <Text className="text-white font-black text-sm">
                            {match.hostTeam?.name}
                          </Text>
                          <Text className="text-[#fbbf24] text-[8px] font-black uppercase tracking-widest">
                            Wants Opponent
                          </Text>
                        </View>
                      </View>
                      <View className="bg-white/5 py-1 px-3 rounded-full">
                        <Text className="text-white/60 text-[9px] font-black uppercase">
                          {match.format}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-4 border-t border-white/5 pt-4">
                      <View className="flex-row items-center gap-2">
                        <MaterialCommunityIcons
                          name="calendar"
                          size={14}
                          color="#666"
                        />
                        <Text className="text-white/60 text-[10px] font-bold">
                          {formatDate(match.date)}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={14}
                          color="#666"
                        />
                        <Text className="text-white/60 text-[10px] font-bold">
                          {match.time}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <MaterialIcons name="place" size={14} color="#666" />
                        <Text
                          className="text-white/60 text-[10px] font-bold truncate"
                          numberOfLines={1}
                        >
                          {match.arena?.name}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleChallenge(match.id)}
                      className="mt-5 w-full bg-amber-400/10 py-3 rounded-xl border border-amber-400/20 items-center justify-center"
                    >
                      <Text className="text-amber-400 font-black text-[10px] uppercase tracking-widest">
                        Challenge Team
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Empty space for bottom nav */}
          <View className="h-40" />
        </ScrollView>
      </View>

      {/* HOST MATCH MODAL */}
      <Modal visible={showHostModal} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/80 justify-end">
          <View className="bg-[#121212] p-8 rounded-t-[40px] border-t border-white/10">
            <View className="flex-row items-center justify-between mb-8">
              <Text className="text-2xl font-black text-white uppercase">
                Host Team Match
              </Text>
              <TouchableOpacity onPress={() => setShowHostModal(false)}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="gap-6 max-h-[500px]"
            >
              {/* Select Team */}
              <View>
                <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">
                  Select Your Team
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row gap-2"
                >
                  {myTeams.map((t) => (
                    <TouchableOpacity
                      key={t.id}
                      onPress={() =>
                        setMatchForm({ ...matchForm, teamId: t.id })
                      }
                      className={`px-4 py-2 rounded-full border ${matchForm.teamId === t.id ? "bg-amber-400 border-amber-400" : "bg-white/5 border-white/10"}`}
                    >
                      <Text
                        className={`font-bold text-[10px] ${matchForm.teamId === t.id ? "text-black" : "text-white/60"}`}
                      >
                        {t.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Select Arena */}
              <View>
                <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3 ml-1">
                  Select Arena
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row gap-3"
                >
                  {arenas.map((a) => (
                    <TouchableOpacity
                      key={a.id}
                      onPress={() =>
                        setMatchForm({ ...matchForm, arenaId: a.id })
                      }
                      className={`w-32 rounded-2xl overflow-hidden border ${matchForm.arenaId === a.id ? "border-amber-400" : "border-white/10"}`}
                    >
                      <Image
                        source={{ uri: a.image }}
                        className="h-20 w-full"
                      />
                      <View className="p-2 bg-black/40">
                        <Text
                          className="text-white font-bold text-[8px] text-center"
                          numberOfLines={1}
                        >
                          {a.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">
                    Date
                  </Text>
                  <TextInput
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold"
                    placeholder="2024-03-25"
                    placeholderTextColor="#444"
                    value={matchForm.date}
                    onChangeText={(val) =>
                      setMatchForm({ ...matchForm, date: val })
                    }
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">
                    Time
                  </Text>
                  <TextInput
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold"
                    placeholder="07:00 PM"
                    placeholderTextColor="#444"
                    value={matchForm.time}
                    onChangeText={(val) =>
                      setMatchForm({ ...matchForm, time: val })
                    }
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleHostMatch}
                disabled={submitting}
                className="bg-[#FFB300] h-16 rounded-2xl items-center justify-center mt-4 mb-10"
              >
                {submitting ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <Text className="font-black uppercase tracking-widest">
                    Broadcast Open Match
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
