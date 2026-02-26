import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchRecruitments, applyToRecruitment } from "../../services/api";

const PlayerCard = ({ recruitment, onApply }) => {
  const [applying, setApplying] = useState(false);
  const { id, host, team, role, level, date, time, playersNeeded, description } = recruitment;
  
  // Format initials from username
  const initials = host?.username?.substring(0, 2).toUpperCase() || "??";
  
  // Basic date formatting
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <View className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-5 mb-4 shadow-sm">
      {/* Top Section: Avatar & Host Info */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center">
          <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${team?.logo ? 'bg-[#064e3b]' : 'bg-[#1e1b4b]'}`}>
            {team?.logo ? (
              <MaterialCommunityIcons name="shield-check" size={20} color="#10b981" />
            ) : (
              <Text className="text-white text-xs font-black">{initials}</Text>
            )}
          </View>
          <View>
            <Text className="text-white text-sm font-bold tracking-tight">{host?.username}</Text>
            <Text className="text-[#A1A1AA] text-[9px] font-bold uppercase tracking-wider">
              {team?.name || "Independent"}
            </Text>
          </View>
        </View>
        <View className="bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
          <Text className="text-amber-400 text-[9px] font-black uppercase">{playersNeeded} needed</Text>
        </View>
      </View>

      {/* Role Title */}
      <Text className="text-white text-lg font-black uppercase mb-2 tracking-tighter">
        {role} Needed
      </Text>

      {description ? (
        <Text className="text-[#A1A1AA] text-xs mb-3 leading-4" numberOfLines={2}>
          {description}
        </Text>
      ) : null}

      {/* Info Badges */}
      <View className="flex-row items-center mb-5 gap-3">
        <View className="flex-row items-center bg-[#1a1a1a] px-3 py-1.5 rounded-xl border border-white/5">
          <Feather name="bar-chart-2" size={12} color="#fbbf24" />
          <Text className="text-[#A1A1AA] text-[10px] font-bold ml-1.5 uppercase tracking-wide">
            {level}
          </Text>
        </View>
        <View className="flex-row items-center bg-[#1a1a1a] px-3 py-1.5 rounded-xl border border-white/5">
          <Feather name="clock" size={12} color="#666" />
          <Text className="text-[#A1A1AA] text-[10px] font-bold ml-1.5 uppercase tracking-wide">
            {formattedDate}, {time}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row">
        <TouchableOpacity 
          disabled={applying}
          onPress={async () => {
            setApplying(true);
            await onApply(id);
            setApplying(false);
          }}
          className={`flex-1 ${applying ? 'bg-amber-400/50' : 'bg-amber-400'} h-11 rounded-xl items-center justify-center active:bg-amber-500`}
        >
          {applying ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Text className="text-black font-black uppercase text-[10px] tracking-widest">Apply Now</Text>
          )}
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

const PlayersTab = () => {
  const router = useRouter();
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    role: null,
    level: null,
  });

  const roles = ["Attacker", "Midfielder", "Defender", "Goalkeeper"];
  const levels = ["Casual", "Intermediate", "Competitive", "Pro"];

  const loadRecruitments = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const params = {};
      if (filters.role) params.role = filters.role;
      if (filters.level) params.level = filters.level;

      const response = await fetchRecruitments(params);
      setRecruitments(response.data);
    } catch (error) {
      console.error("Error fetching recruitments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadRecruitments();
  }, [loadRecruitments]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRecruitments(false);
  };

  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
  };

  const handleApply = async (recruitmentId) => {
    try {
      await applyToRecruitment(recruitmentId);
      Alert.alert("Success", "Application sent successfully!");
    } catch (error) {
      console.error("Error applying:", error);
      const message = error.response?.data?.message || "Failed to send application";
      Alert.alert("Error", message);
    }
  };

  return (
    <>
      <View className="flex-1">
        {/* Filter Section */}
        <View className="px-6 py-4 border-b border-white/5 bg-black">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            <FilterChip 
              label="All Roles" 
              selected={!filters.role} 
              onSelect={() => toggleFilter('role', null)} 
            />
            {roles.map(role => (
              <FilterChip 
                key={role}
                label={role}
                selected={filters.role === role}
                onSelect={(val) => toggleFilter('role', val)}
              />
            ))}
          </ScrollView>
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
            ) : recruitments.length > 0 ? (
              recruitments.map(item => (
                <PlayerCard key={item.id} recruitment={item} onApply={handleApply} />
              ))
            ) : (
              <View className="items-center justify-center mt-20">
                <Feather name="search" size={48} color="#3f3f46" />
                <Text className="text-[#A1A1AA] font-bold mt-4">No players needed matching your filters</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={() => router.push("/players-recruit/post-need")}
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
        <Text className="text-black font-black uppercase tracking-widest ml-2">Post Need</Text>
      </TouchableOpacity>
    </>
  );
};

export default PlayersTab;
