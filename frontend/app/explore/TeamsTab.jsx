import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchTeams } from "../../services/api";

const TeamCard = ({ team }) => {
  const { name, level, membersCount, logo, description, captain } = team;
  
  return (
    <View className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-5 mb-4 shadow-sm">
      {/* Top Section: Logo & Badge */}
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-amber-400/10 rounded-xl items-center justify-center mr-4 border border-amber-400/20">
            {logo ? (
              <Image source={{ uri: logo }} className="w-full h-full rounded-xl" />
            ) : (
              <FontAwesome5 name="shield-alt" size={24} color="#fbbf24" />
            )}
          </View>
          <View>
            <Text className="text-white text-lg font-black uppercase tracking-tight">{name}</Text>
            <View className="flex-row items-center mt-0.5">
              <MaterialCommunityIcons name="account-star" size={12} color="#fbbf24" />
              <Text className="text-[#A1A1AA] text-[10px] font-bold uppercase tracking-wider ml-1">
                {captain?.username || "No Captain"}
              </Text>
            </View>
          </View>
        </View>
        <View className="bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20">
          <Text className="text-amber-400 text-[9px] font-black uppercase">{level}</Text>
        </View>
      </View>

      {description ? (
        <Text className="text-[#A1A1AA] text-xs mb-4 leading-4" numberOfLines={2}>
          {description}
        </Text>
      ) : null}

      {/* Stats Divider */}
      <View className="h-[1px] bg-white/5 w-full mb-4" />

      {/* Team Info Row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-4">
          <View className="flex-row items-center">
            <MaterialIcons name="groups" size={16} color="#666" />
            <Text className="text-white/60 text-[10px] font-black ml-1.5 uppercase">
              {membersCount || 0} Members
            </Text>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="trophy-outline" size={14} color="#666" />
            <Text className="text-white/60 text-[10px] font-black ml-1.5 uppercase">
              86% Win Rate
            </Text>
          </View>
        </View>
        
        <TouchableOpacity className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <Text className="text-white text-[9px] font-black uppercase tracking-widest">View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FilterChip = ({ label, selected, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(label)}
    className={`px-4 py-2 rounded-xl border mr-2 ${
      selected ? "bg-amber-400 border-amber-400" : "bg-[#111] border-white/5"
    }`}
  >
    <Text className={`text-[10px] font-black uppercase ${selected ? "text-black" : "text-white/40"}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const TeamsTab = () => {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    level: null,
  });

  const levels = ["Casual", "Intermediate", "Competitive", "Pro"];

  const loadTeams = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const params = {};
      if (filters.level) params.level = filters.level;

      const response = await fetchTeams(params);
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTeams(false);
  };

  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
  };

  return (
    <>
      <View className="flex-1">
        {/* Filter Section */}
        <View className="px-6 py-4 border-b border-white/5 bg-black">
          <Text className="text-white/20 text-[9px] font-black uppercase tracking-[3px] mb-3 ml-1">Filter by Level</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip 
              label="All Levels" 
              selected={!filters.level} 
              onSelect={() => toggleFilter('level', null)} 
            />
            {levels.map(level => (
              <FilterChip 
                key={level}
                label={level}
                selected={filters.level === level}
                onSelect={(val) => toggleFilter('level', val)}
              />
            ))}
          </ScrollView>
        </View>

        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbbf24" />
          }
        >
          <View className="pt-6 pb-32">
            {loading ? (
              <ActivityIndicator color="#fbbf24" size="large" className="mt-10" />
            ) : teams.length > 0 ? (
              teams.map(item => (
                <TeamCard key={item.id} team={item} />
              ))
            ) : (
              <View className="items-center justify-center mt-20">
                <FontAwesome5 name="shield-alt" size={48} color="#3f3f46" />
                <Text className="text-[#A1A1AA] font-bold mt-4 text-center">No teams found matching your criteria</Text>
                <TouchableOpacity 
                   onPress={() => loadTeams()}
                   className="mt-4"
                >
                  <Text className="text-amber-400 font-black uppercase text-[10px] tracking-widest">Refresh List</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={() => {
          // Navigate to create team page (assuming it exists or will be created)
          // router.push("/create-team") 
        }}
        style={{
          position: 'absolute',
          bottom: 120,
          right: 24,
          backgroundColor: '#fbbf24',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderRadius: 30,
          shadowColor: '#fbbf24',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        <MaterialIcons name="add" size={24} color="black" />
        <Text className="text-black font-black uppercase tracking-widest ml-2">Create Team</Text>
      </TouchableOpacity>
    </>
  );
};

export default TeamsTab;
