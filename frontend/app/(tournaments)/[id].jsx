import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchTournamentById } from "../../services/api";

export default function TournamentDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTournament = async () => {
      try {
        setLoading(true);
        const res = await fetchTournamentById(id);
        setTournament(res.data);
      } catch (error) {
        console.error("Fetch tournament error:", error);
        Alert.alert("Error", "Failed to load tournament details");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    loadTournament();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="#fbbf24" size="large" />
      </View>
    );
  }

  if (!tournament) return null;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header Overlay */}
        <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between p-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/50 items-center justify-center border border-white/10"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-black/50 items-center justify-center border border-white/10"
          >
            <MaterialIcons name="share" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Cover Image */}
          <View className="w-full h-80 relative">
            <Image 
              source={{ uri: tournament.image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop" }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <View className="absolute bottom-6 left-6 right-6">
              <View className="bg-amber-400 self-start px-3 py-1 rounded-full mb-3">
                <Text className="text-black text-[10px] font-black uppercase tracking-widest">{tournament.status || "OPEN"}</Text>
              </View>
              <Text className="text-white text-4xl font-black uppercase tracking-tighter leading-10">
                {tournament.name}
              </Text>
            </View>
          </View>

          {/* Details Content */}
          <View className="px-6 py-8">
            <View className="flex-row gap-6 mb-10 overflow-visible">
              <View className="items-center">
                 <View className="w-12 h-12 bg-zinc-900 rounded-2xl items-center justify-center border border-white/5 mb-2">
                    <MaterialIcons name="event" size={24} color="#fbbf24" />
                 </View>
                 <Text className="text-white/40 text-[8px] font-black uppercase tracking-widest">Date</Text>
                 <Text className="text-white font-bold text-xs mt-1">
                    {new Date(tournament.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                 </Text>
              </View>

              <View className="items-center">
                 <View className="w-12 h-12 bg-zinc-900 rounded-2xl items-center justify-center border border-white/5 mb-2">
                    <MaterialIcons name="place" size={24} color="#fbbf24" />
                 </View>
                 <Text className="text-white/40 text-[8px] font-black uppercase tracking-widest">Venue</Text>
                 <Text className="text-white font-bold text-xs mt-1" numberOfLines={1}>
                    {tournament.location}
                 </Text>
              </View>

              <View className="items-center">
                 <View className="w-12 h-12 bg-zinc-900 rounded-2xl items-center justify-center border border-white/5 mb-2">
                    <MaterialCommunityIcons name="currency-inr" size={24} color="#fbbf24" />
                 </View>
                 <Text className="text-white/40 text-[8px] font-black uppercase tracking-widest">Entry</Text>
                 <Text className="text-white font-bold text-xs mt-1">
                    Rs. {tournament.entryFee}
                 </Text>
              </View>

              <View className="items-center">
                 <View className="w-12 h-12 bg-zinc-900 rounded-2xl items-center justify-center border border-white/5 mb-2">
                    <MaterialCommunityIcons name="trophy" size={24} color="#fbbf24" />
                 </View>
                 <Text className="text-white/40 text-[8px] font-black uppercase tracking-widest">Prize</Text>
                 <Text className="text-white font-bold text-xs mt-1">
                    {tournament.prizePool ? `Rs. ${tournament.prizePool}` : "Trophy"}
                 </Text>
              </View>
            </View>

            <View className="mb-10">
              <Text className="text-white font-black text-xl uppercase tracking-tighter mb-4 italic">About Tournament</Text>
              <Text className="text-white/50 text-sm leading-6 font-medium">
                {tournament.description || "Join this exciting futsal tournament and showcase your skills. Compete with the best teams for glory and amazing prizes!"}
              </Text>
            </View>

            {/* Stats/Metrics */}
            <View className="bg-zinc-900/50 p-6 rounded-[32px] border border-white/5 mb-10">
               <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">Registration Status</Text>
                  <Text className="text-amber-400 text-[10px] font-black uppercase tracking-widest">7/16 Teams</Text>
               </View>
               <View className="w-full h-2 bg-black rounded-full overflow-hidden">
                  <View className="w-[45%] h-full bg-amber-400 rounded-full shadow-lg shadow-amber-400/50" />
               </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => Alert.alert("Coming Soon", "Team registration will be available shortly.")}
              className="bg-amber-400 py-6 rounded-[32px] items-center justify-center mb-10 shadow-xl shadow-amber-400/20"
            >
              <Text className="text-black font-black text-md uppercase tracking-[4px]">Register Team</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
