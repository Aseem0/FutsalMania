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
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchMatchById, joinMatch, fetchUserProfile } from "../../services/api";

export default function MatchDetailsScreen() {
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
        fetchMatchById(id),
        fetchUserProfile(),
      ]);
      setMatch(matchRes.data);
      setCurrentUser(userRes.data);
    } catch (error) {
      console.error("Error loading match details:", error);
      Alert.alert("Error", "Could not load game details.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      setJoining(true);
      await joinMatch(id);
      Alert.alert("Success", "You've joined the squad! See you on the pitch. ⚽");
      loadData(); // Refresh to show new player count
    } catch (error) {
      const message = error.response?.data?.message || "Failed to join match.";
      Alert.alert("Error", message);
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
  const isJoined = match?.players?.some(p => p.id === currentUser?.id);
  const isFull = match?.currentPlayers >= match?.maxPlayers;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Hero Image Section */}
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
        </View>

        <ScrollView 
          className="flex-1 -mt-10 bg-black rounded-t-[40px] px-6 pt-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Arena Header */}
          <View className="mb-6">
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="place" size={14} color="#fbbf24" />
              <Text className="text-amber-400 text-[10px] font-black uppercase tracking-widest ml-1">
                {match?.arena?.location}
              </Text>
            </View>
            <Text className="text-3xl font-black text-white mb-2">
              {match?.arena?.name}
            </Text>
            <View className="flex-row items-center">
              <View className="flex-row items-center bg-white/5 py-1 px-3 rounded-full border border-white/5">
                <FontAwesome5 name="users" size={10} color="#666" />
                <Text className="text-white/60 text-[10px] font-bold ml-2">
                  {match?.currentPlayers} / {match?.maxPlayers} Players Joined
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Info Grid */}
          <View className="flex-row gap-3 mb-8">
            <InfoCard icon="calendar-alt" label="Date" value={match?.date} />
            <InfoCard icon="clock" label="Time" value={match?.time} />
            <InfoCard icon="tag" label="Price" value={`Rs. ${match?.price || 0}`} />
          </View>

          {/* Match Details Section */}
          <SectionHeader title="Game Details" />
          <View className="bg-[#111] p-5 rounded-3xl border border-white/5 gap-4 mb-8">
            <DetailRow icon="format-list-bulleted" label="Format" value={match?.format} />
            <DetailRow icon="trending-up" label="Skill Level" value={match?.skillLevel} />
            <DetailRow icon="account-tie" label="Organizer" value={match?.host?.username} />
          </View>

          {/* Players Section (Only show if players exist) */}
          {match?.players?.length > 0 && (
            <>
              <SectionHeader title="Squad Members" />
              <View className="flex-row flex-wrap gap-3 mb-8">
                {match.players.map((player) => (
                  <View key={player.id} className="items-center">
                    <View className="h-12 w-12 rounded-full overflow-hidden border border-amber-400/30">
                      <Image 
                        source={{ uri: player.profilePicture || "https://ui-avatars.com/api/?name=" + player.username }} 
                        className="w-full h-full"
                      />
                    </View>
                    <Text className="text-white/40 text-[8px] font-bold mt-1 text-center w-12" numberOfLines={1}>
                      {player.username}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Empty space for bottom floating button */}
          <View className="h-40" />
        </ScrollView>

        {/* Bottom Action Bar */}
        <View className="absolute bottom-0 left-0 right-0 bg-black/80 p-6 border-t border-white/5">
          {!isHost && !isJoined ? (
            <TouchableOpacity 
              onPress={handleJoin}
              disabled={joining || isFull}
              className={`w-full h-16 rounded-2xl flex-row items-center justify-center ${isFull ? 'bg-white/10' : 'bg-amber-400'}`}
            >
              {joining ? (
                <ActivityIndicator color="black" />
              ) : (
                <>
                  <Text className={`font-black uppercase tracking-widest text-lg ${isFull ? 'text-white/20' : 'text-black'}`}>
                    {isFull ? "Match Full" : "Join Game • Rs. " + (match?.price || 0)}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View className="bg-white/5 h-16 rounded-2xl items-center justify-center border border-white/5">
              <Text className="text-amber-400 font-bold uppercase tracking-widest text-xs">
                {isHost ? "You are organizing this game" : "You are in the squad!"}
              </Text>
            </View>
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
