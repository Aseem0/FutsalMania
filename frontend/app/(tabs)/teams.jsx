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
    ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBD';

  return (
    <View className="mb-8 bg-[#050505] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
      {/* Post Header - Admin Attribution */}
      <View className="flex-row items-center px-6 py-5">
        <View className="w-10 h-10 rounded-full bg-amber-400 items-center justify-center">
          <Text className="text-black font-black text-xs">R</Text>
        </View>
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="text-white font-black text-sm uppercase tracking-tight">Ram (Admin)</Text>
            <MaterialIcons name="verified" size={14} color="#fbbf24" style={{ marginLeft: 4 }} />
          </View>
          <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-0.5">Certified Organizer</Text>
        </View>
        <TouchableOpacity className="p-2">
          <MaterialCommunityIcons name="dots-horizontal" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      {image && (
        <View className="px-3">
          <Image 
            source={{ uri: image }} 
            className="w-full h-64 rounded-[32px] bg-zinc-900 shadow-lg shadow-black/80" 
            resizeMode="cover"
          />
        </View>
      )}

      {/* Post Body */}
      <View className="p-6">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1 mr-4">
            <Text className="text-white font-black text-2xl uppercase tracking-tighter leading-7">
              {name}
            </Text>
            <View className="flex-row items-center mt-2">
              <View className="bg-amber-400 px-2 py-0.5 rounded-full mr-2">
                 <Text className="text-black text-[8px] font-black uppercase tracking-widest">{status || "OPEN"}</Text>
              </View>
              <Text className="text-white/40 font-black text-[10px] uppercase tracking-[2px]">
                {prizePool ? `Prize Pool: Rs. ${prizePool}` : "GLORY AWAITS"}
              </Text>
            </View>
          </View>
        </View>

        {description && (
          <Text className="text-white/50 text-xs font-medium leading-5 mb-6" numberOfLines={3}>
            {description}
          </Text>
        )}

        {/* Info Grid */}
        <View className="flex-row flex-wrap gap-2 mb-8">
          <View className="flex-row items-center bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
            <MaterialIcons name="event" size={14} color="#fbbf24" />
            <Text className="text-white font-bold text-[10px] ml-2 uppercase tracking-tight">{displayDate}</Text>
          </View>
          <View className="flex-row items-center bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
            <MaterialIcons name="place" size={14} color="#fbbf24" />
            <Text className="text-white/60 font-bold text-[10px] ml-2 uppercase tracking-tight" numberOfLines={1}>{location}</Text>
          </View>
        </View>

        {/* Footer Action */}
        <View className="flex-row items-center justify-between pt-6 border-t border-white/5">
          <View>
            <Text className="text-white/20 text-[8px] font-black uppercase tracking-[3px] mb-1">Registration</Text>
            <Text className="text-white font-black text-xl tracking-tighter">Rs. {entryFee || "Free"}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => onJoin(tournament.id)}
            activeOpacity={0.8}
            className="bg-amber-400 px-8 py-4 rounded-[24px] shadow-xl shadow-amber-400/20"
          >
            <Text className="text-black text-[11px] font-black uppercase tracking-widest leading-3">Join This Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function TeamsScreen() {
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
              <Text className="text-4xl font-black text-white uppercase tracking-tighter italic">Tournaments</Text>
              <Text className="text-white/40 mt-1 text-[10px] font-black uppercase tracking-[3px]">Official Futsal Events</Text>
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
                  <Text className="text-black font-black text-xl uppercase tracking-tighter">Post Tournament</Text>
                  <Text className="text-black/40 text-[9px] font-black uppercase tracking-widest mt-0.5">Open a new event for users</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Feed Header */}
          <View className="px-6 mb-6 mt-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white font-black text-2xl uppercase tracking-tighter">Live Events</Text>
                <Text className="text-white/40 text-[9px] font-bold uppercase tracking-[3px] mt-1">Browse and Join</Text>
              </View>
              <TouchableOpacity onPress={() => loadData()} className="p-2 bg-white/5 rounded-full">
                <MaterialIcons name="refresh" size={18} color="#fbbf24" />
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View className="items-center justify-center py-20">
               <ActivityIndicator color="#fbbf24" />
               <Text className="text-white/20 font-black uppercase text-[9px] mt-4 tracking-widest">Fetching Events...</Text>
            </View>
          ) : tournaments.length === 0 ? (
            <View className="px-6">
              <View className="bg-[#111] p-12 rounded-[40px] border border-white/5 items-center justify-center italic">
                <MaterialCommunityIcons name="trophy-variant-outline" size={40} color="rgba(255,255,255,0.03)" />
                <Text className="text-white/20 mt-6 font-black uppercase text-center tracking-widest text-[10px]">No upcoming tournaments</Text>
              </View>
            </View>
          ) : (
            <View className="px-6 pb-40">
              {tournaments.map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  onJoin={(id) => Alert.alert("Coming Soon", "Tournament registration will be available shortly.")} 
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
