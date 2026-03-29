import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { fetchTournaments } from "../../services/api";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

const TournamentCard = ({ tournament, onJoin }) => {
  const { name, description, date, location, entryFee, prizePool, image, status } = tournament;
  
  const displayDate = date 
    ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }).toUpperCase()
    : 'TBD';

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={() => onJoin(tournament.id)}
      className="mb-6 w-full h-64 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl relative"
    >
      {/* Background Image */}
      <Image 
        source={{ uri: image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop" }} 
        className="absolute inset-0 w-full h-full bg-zinc-900" 
        resizeMode="cover"
      />
      
      {/* Gradient Overlay */}
      <View className="absolute inset-0 bg-black/60" />
      
      {/* Content Overlay */}
      <View className="flex-1 p-7 justify-between">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-4">
            <Text className="text-white font-outfit-bold text-2xl uppercase tracking-tighter leading-7 shadow-lg">
              {name}
            </Text>
            <View className="flex-row items-center mt-2">
              <View className="bg-amber-400 px-2 py-0.5 rounded-full mr-2">
                 <Text className="text-black text-[8px] font-inter-black uppercase tracking-widest">{status || "OPEN"}</Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="place" size={12} color="#fbbf24" />
                <Text className="text-white/70 font-inter-bold text-[9px] ml-1 uppercase tracking-tight" numberOfLines={1}>{location}</Text>
              </View>
            </View>
          </View>
          <View className="bg-black/40 px-3 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <Text className="text-white text-[10px] font-inter-black uppercase tracking-widest">{displayDate}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between bg-white/5 p-4 rounded-[28px] border border-white/10">
          <View>
            <Text className="text-white/40 text-[8px] font-inter-black uppercase tracking-[3px] mb-1">Entry Fee</Text>
            <Text className="text-white font-outfit-bold text-lg tracking-tighter">Rs. {entryFee || "0"}</Text>
          </View>
          <View className="items-end">
            <Text className="text-amber-400 font-inter-black text-[10px] uppercase tracking-widest mb-1">
              {prizePool ? `Rs. ${prizePool}` : "TROPHY"}
            </Text>
            <Text className="text-white/40 text-[8px] font-inter-black uppercase tracking-[3px]">Prize Pool</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function TournamentsScreen() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState("user");

  const loadData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [tournamentsRes, role] = await Promise.all([
        fetchTournaments(),
        AsyncStorage.getItem("userRole")
      ]);
      setTournaments(tournamentsRes.data);
      setUserRole(role || "user");
    } catch (error) {
      console.error("Error loading tournament data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData(false);
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        <View className="bg-black/90 px-6 py-8 border-b border-[#1F1F1F]">
          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-4xl font-outfit-bold text-white uppercase tracking-tighter italic">Tournaments</Text>
              <Text className="text-white/40 mt-1 text-[10px] font-inter-black uppercase tracking-[3px]">Official Futsal Events</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbbf24" />
          }
        >
          {/* Admin Action Area */}
          {userRole === "admin" && (
            <View className="px-6 pt-8 mb-6">
              <TouchableOpacity
                onPress={() => router.push('/create-tournament')}
                className="w-full bg-amber-400 h-24 rounded-[32px] flex-row items-center justify-center border-b-4 border-amber-600 shadow-2xl"
                activeOpacity={0.9}
              >
                <View className="w-12 h-12 bg-black/10 rounded-2xl items-center justify-center">
                  <MaterialCommunityIcons name="trophy-plus" size={24} color="black" />
                </View>
                <View className="ml-4">
                  <Text className="text-black font-outfit-bold text-xl uppercase tracking-tighter">Post Tournament</Text>
                  <Text className="text-black/40 text-[9px] font-inter-bold uppercase tracking-widest mt-0.5">Open a new event for users</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Feed Header */}
          <View className="px-6 mb-6 mt-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white font-outfit-bold text-2xl uppercase tracking-tighter">Live Events</Text>
                <Text className="text-white/40 text-[9px] font-inter-bold uppercase tracking-[3px] mt-1">Browse and Join</Text>
              </View>
              <TouchableOpacity onPress={() => loadData()} className="p-2 bg-white/5 rounded-full">
                <MaterialIcons name="refresh" size={18} color="#fbbf24" />
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View className="items-center justify-center py-20">
               <ActivityIndicator color="#fbbf24" />
               <Text className="text-white/20 font-inter-black uppercase text-[9px] mt-4 tracking-widest">Fetching Events...</Text>
            </View>
          ) : tournaments.length === 0 ? (
            <View className="px-6">
              <View className="bg-[#111] p-12 rounded-[40px] border border-white/5 items-center justify-center italic">
                <MaterialCommunityIcons name="trophy-variant-outline" size={40} color="rgba(255,255,255,0.03)" />
                <Text className="text-white/20 mt-6 font-inter-black uppercase text-center tracking-widest text-[10px]">No upcoming tournaments</Text>
              </View>
            </View>
          ) : (
            <View className="px-6 pb-40">
              {tournaments.map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  onJoin={(id) => router.push({
                    pathname: "/(tournaments)/[id]",
                    params: { id }
                  })} 
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
