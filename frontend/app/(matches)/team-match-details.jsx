import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchTeamMatchById, joinTeamMatchAsOpponent, fetchMyTeams, fetchUserProfile } from "../../services/api";

export default function TeamMatchDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [match, setMatch] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [matchRes, userRes] = await Promise.all([
        fetchTeamMatchById(id),
        fetchUserProfile(),
      ]);
      setMatch(matchRes.data);
      setCurrentUser(userRes.data);
    } catch (error) {
      console.error("Error loading team match details:", error);
      Alert.alert("Error", "Could not load match details.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleChallenge = async () => {
    try {
      setJoining(true);
      const teamRes = await fetchMyTeams();
      const myTeams = teamRes.data;

      if (!myTeams || myTeams.length === 0) {
        Alert.alert("Squad Required", "You need a team to accept challenges.");
        return;
      }

      const myTeam = myTeams[0];
      const teamName = match?.customTeamName || match?.hostTeam?.name || "this team";

      Alert.alert(
        "Confirm Challenge",
        `Challenge ${teamName} using ${myTeam.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "SEND CHALLENGE",
            onPress: async () => {
              try {
                await joinTeamMatchAsOpponent(id, myTeam.id);
                Alert.alert("Match Scheduled!", "See you on the pitch. ⚽");
                loadData();
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
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="#FFB300" />
      </View>
    );
  }

  const isHost = currentUser?.id === match?.hostId;
  const isScheduled = match?.status === "scheduled";
  const teamName = match?.customTeamName || match?.hostTeam?.name || "Open Challenge";

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Hero Image */}
        <View className="relative w-full h-80">
          <Image
            source={{ uri: match?.arena?.image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop" }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-6 w-10 h-10 items-center justify-center rounded-full bg-black/50 border border-white/10"
          >
            <MaterialIcons name="chevron-left" size={28} color="white" />
          </TouchableOpacity>

          {/* Status Badge */}
          <View className="absolute top-4 right-6">
            <View className={`px-3 py-1.5 rounded-xl border ${isScheduled ? 'bg-green-500 border-green-600' : 'bg-amber-400 border-amber-500'}`}>
              <Text className={`text-[10px] font-black uppercase tracking-widest ${isScheduled ? 'text-white' : 'text-black'}`}>
                {match?.status}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1 -mt-10 bg-black rounded-t-[40px] px-6 pt-8"
          showsVerticalScrollIndicator={false}
        >
          {/* VS Header */}
          <View className="mb-6">
            <View className="flex-row items-center mb-1">
              <FontAwesome5 name="shield-alt" size={12} color="#fbbf24" />
              <Text className="text-amber-400 text-[10px] font-black uppercase tracking-widest ml-2">
                Team Challenge
              </Text>
            </View>

            {/* VS Card */}
            <View className="bg-[#111] p-5 rounded-3xl border border-white/5 mt-3">
              <View className="flex-row items-center justify-between">
                {/* Host Team */}
                <View className="items-center flex-1">
                  <View className="w-14 h-14 bg-amber-400/10 rounded-2xl items-center justify-center border border-amber-400/20 mb-2">
                    {match?.hostTeam?.logo ? (
                      <Image source={{ uri: match.hostTeam.logo }} className="w-full h-full rounded-2xl" />
                    ) : (
                      <FontAwesome5 name="shield-alt" size={22} color="#fbbf24" />
                    )}
                  </View>
                  <Text className="text-white font-black text-xs uppercase text-center" numberOfLines={1}>
                    {teamName}
                  </Text>
                  <Text className="text-white/30 text-[8px] font-bold uppercase mt-0.5">Host</Text>
                </View>

                {/* VS */}
                <View className="mx-4 items-center">
                  <Text className="text-amber-400 text-2xl font-black italic">VS</Text>
                </View>

                {/* Guest Team */}
                <View className="items-center flex-1">
                  <View className="w-14 h-14 bg-white/5 rounded-2xl items-center justify-center border border-white/10 mb-2">
                    {match?.guestTeam?.logo ? (
                      <Image source={{ uri: match.guestTeam.logo }} className="w-full h-full rounded-2xl" />
                    ) : (
                      <Text className="text-white/20 text-2xl font-black">?</Text>
                    )}
                  </View>
                  <Text className="text-white font-black text-xs uppercase text-center" numberOfLines={1}>
                    {match?.guestTeam?.name || "Waiting..."}
                  </Text>
                  <Text className="text-white/30 text-[8px] font-bold uppercase mt-0.5">Opponent</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Info */}
          <View className="flex-row gap-3 mb-8">
            <InfoCard icon="calendar-alt" label="Date" value={match?.date} />
            <InfoCard icon="clock" label="Time" value={match?.time} />
            <InfoCard icon="tag" label="Price" value={`Rs. ${match?.price || 0}`} />
          </View>

          {/* Match Details */}
          <SectionHeader title="Match Details" />
          <View className="bg-[#111] p-5 rounded-3xl border border-white/5 gap-4 mb-8">
            <DetailRow icon="soccer" label="Format" value={match?.format} />
            <DetailRow icon="map-marker" label="Arena" value={match?.arena?.name} />
            <DetailRow icon="map-marker-outline" label="Location" value={match?.arena?.location} />
            <DetailRow icon="account-tie" label="Organizer" value={match?.host?.username} />
          </View>

          <View className="h-40" />
        </ScrollView>

        {/* Bottom Action Bar */}
        <View
          className="absolute bottom-0 left-0 right-0 bg-black/80 p-6 border-t border-white/5"
          style={{ zIndex: 100 }}
        >
          {isHost ? (
            <View className="w-full h-16 rounded-2xl flex-row items-center justify-center bg-white/5 border border-white/10">
              <FontAwesome5 name="broadcast-tower" size={16} color="#fbbf24" />
              <Text className="font-black uppercase tracking-[2px] text-white/60 ml-3">
                {isScheduled ? "Match Scheduled" : "Your Challenge is Live"}
              </Text>
            </View>
          ) : isScheduled ? (
            <View className="w-full h-16 rounded-2xl flex-row items-center justify-center bg-green-500/10 border border-green-500/30">
              <MaterialIcons name="check-circle" size={20} color="#22c55e" />
              <Text className="font-black uppercase tracking-[2px] text-green-400 ml-2">
                Match Scheduled
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleChallenge}
              disabled={joining}
              className="w-full h-16 rounded-2xl flex-row items-center justify-center bg-amber-400"
            >
              {joining ? (
                <ActivityIndicator color="black" />
              ) : (
                <>
                  <FontAwesome5 name="fist-raised" size={18} color="black" />
                  <Text className="font-black uppercase tracking-widest text-lg text-black ml-3">
                    Challenge Team
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const InfoCard = ({ icon, label, value }) => (
  <View className="flex-1 bg-[#111] p-4 rounded-3xl border border-white/5 items-center">
    <FontAwesome5 name={icon} size={16} color="#fbbf24" />
    <Text className="text-white/40 text-[8px] font-black uppercase mt-2 tracking-widest">{label}</Text>
    <Text className="text-white font-bold text-sm mt-1">{value}</Text>
  </View>
);

const DetailRow = ({ icon, label, value }) => (
  <View className="flex-row items-center justify-between">
    <View className="flex-row items-center">
      <MaterialCommunityIcons name={icon} size={20} color="#fbbf24" />
      <Text className="text-white/60 font-medium ml-3">{label}</Text>
    </View>
    <Text className="text-white font-black uppercase text-xs tracking-widest">{value}</Text>
  </View>
);

const SectionHeader = ({ title }) => (
  <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4 ml-1">
    {title}
  </Text>
);
