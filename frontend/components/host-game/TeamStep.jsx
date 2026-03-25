import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { fetchMyTeams } from "../../services/api";

export default function TeamStep({ selectedTeam, onSelect, matchData }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { arena, details, settings } = matchData || {};

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const response = await fetchMyTeams();
      setTeams(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load teams:", err);
      setError("Unable to load teams. Please ensure you are part of a team.");
    } finally {
      setLoading(false);
    }
  };

  const displayDate = details?.date 
    ? new Date(details.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'TBD';

  return (
    <ScrollView
      className="flex-1 px-6 pb-5"
      showsVerticalScrollIndicator={false}
    >
      {/* Match Summary (Comprehensive Review) - ALWAYS VISIBLE */}
      <View className="mt-4 mb-10 overflow-hidden">
        <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="fact-check" size={16} color="#fbbf24" />
            <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px]">Match Summary</Text>
        </View>

        <View className="bg-[#111] rounded-[24px] border border-white/5 overflow-hidden shadow-2xl">
            {/* Arena & Schedule Header */}
            <View className="flex-row p-4 border-b border-white/5 bg-white/5">
                <View className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
                    <Image source={{ uri: arena?.image }} className="w-full h-full" resizeMode="cover" />
                </View>
                <View className="flex-1 ml-4 justify-center">
                    <Text className="text-white font-black text-sm uppercase tracking-tight" numberOfLines={1}>
                        {arena?.name || 'No Arena selected'}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <MaterialIcons name="place" size={10} color="rgba(255,255,255,0.4)" />
                        <Text className="text-white/40 text-[9px] font-bold ml-1 uppercase" numberOfLines={1}>
                            {arena?.location || 'Unknown location'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Match Rules & Details Grid */}
            <View className="p-4 flex-row justify-between">
                <View className="flex-1 items-center gap-1">
                    <MaterialIcons name="calendar-today" size={14} color="#fbbf24" />
                    <Text className="text-white font-black text-[10px]">{displayDate}</Text>
                    <Text className="text-white/20 text-[7px] font-black uppercase tracking-widest">Date</Text>
                </View>
                <View className="w-[1px] h-8 bg-white/5" />
                <View className="flex-1 items-center gap-1">
                    <MaterialIcons name="access-time" size={14} color="#fbbf24" />
                    <Text className="text-white font-black text-[10px]">{details?.time || 'TBD'}</Text>
                    <Text className="text-white/20 text-[7px] font-black uppercase tracking-widest">Time</Text>
                </View>
                <View className="w-[1px] h-8 bg-white/5" />
                <View className="flex-1 items-center gap-1">
                    <MaterialCommunityIcons name="shield-search" size={14} color="#fbbf24" />
                    <Text className="text-white font-black text-[10px] uppercase">{settings?.skillLevel || 'Any'}</Text>
                    <Text className="text-white/20 text-[7px] font-black uppercase tracking-widest">Skill</Text>
                </View>
                <View className="w-[1px] h-8 bg-white/5" />
                <View className="flex-1 items-center gap-1">
                    <MaterialCommunityIcons name="soccer" size={14} color="#fbbf24" />
                    <Text className="text-white font-black text-[10px]">{settings?.format || '5v5'}</Text>
                    <Text className="text-white/20 text-[7px] font-black uppercase tracking-widest">Format</Text>
                </View>
            </View>
        </View>
      </View>

      <View>
        <Text className="text-2xl font-black mb-2 text-white uppercase italic tracking-tighter">
          Select Team
        </Text>
        <Text className="text-white/50 text-sm mb-8 font-medium">
          Choose which team will be hosting the challenge.
        </Text>
      </View>

      {/* Dynamic Content Area (Loading / Error / List) */}
      <View className="min-h-[200px]">
        {loading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color="#fbbf24" />
            <Text className="text-white/40 mt-4 font-bold">Fetching your squads...</Text>
          </View>
        ) : (error || teams.length === 0) ? (
          <View className="py-12 items-center justify-center px-4">
            <FontAwesome5 name="shield-alt" size={48} color="rgba(255,255,255,0.1)" />
            <Text className="text-white/60 text-center mt-4 font-bold">
              {error || "You haven't joined or created any teams yet."}
            </Text>
            <TouchableOpacity onPress={loadTeams} className="mt-6 bg-amber-400 px-6 py-3 rounded-xl">
              <Text className="text-black font-black uppercase text-xs">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-4">
            {teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                onPress={() => onSelect(team)}
                activeOpacity={0.8}
                className={`p-4 rounded-2xl flex-row gap-4 items-center border ${
                  selectedTeam?.id === team.id
                    ? "bg-amber-400/5 border-amber-400"
                    : "bg-[#111] border-white/5"
                }`}
              >
                <View className="w-14 h-14 rounded-2xl bg-amber-400/10 items-center justify-center border border-amber-400/20">
                  <FontAwesome5 name="shield-alt" size={24} color="#fbbf24" />
                </View>

                <View className="flex-1">
                  <Text className="font-black text-white text-lg uppercase tracking-tight">
                    {team.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MaterialCommunityIcons name="account-group" size={14} color="rgba(255,255,255,0.4)" />
                    <Text className="text-white/40 text-[10px] ml-1 font-bold uppercase">
                      {team.members?.length || 0} Members
                    </Text>
                  </View>
                </View>

                {selectedTeam?.id === team.id && (
                  <View className="bg-amber-400 rounded-full w-6 h-6 items-center justify-center">
                    <MaterialIcons name="check" size={16} color="#000000" />
                  </View>
                )}
              </TouchableOpacity>
            ))}

            <View className="py-8">
              <Text className="text-white/20 text-[10px] uppercase tracking-[3px] font-black text-center">
                {teams.length} teams available
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
