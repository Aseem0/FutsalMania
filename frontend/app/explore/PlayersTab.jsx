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
import { fetchRecruitments, applyToRecruitment, deleteRecruitment, fetchUserProfile } from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";

const PlayerCard = ({ recruitment, onApply, onDelete, isHost }) => {
  const [applying, setApplying] = useState(false);
  const { id, host, team, role, level, date, time, playersNeeded, description, contactNumber } = recruitment;
  
  // Format initials from username
  const initials = host?.username?.substring(0, 2).toUpperCase() || "??";
  
  // Basic date formatting
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <View className="bg-[#121212] border border-[#1f1f1f] rounded-3xl p-5 mb-6 justify-between shadow-sm">
      <View>
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-row items-center">
            <View className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${team?.logo ? 'bg-[#064e3b]' : 'bg-[#1e1b4b]'}`}>
              {team?.logo ? (
                <MaterialCommunityIcons name="shield-check" size={16} color="#10b981" />
              ) : (
                <Text className="text-white text-[10px] font-black">{initials}</Text>
              )}
            </View>
            <View>
              <Text className="text-white text-xs font-bold tracking-tight">{host?.username}</Text>
              <Text className="text-[#A1A1AA] text-[8px] font-bold uppercase tracking-wider">
                {team?.name || "Independent"}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
              <Text className="text-amber-400 text-[8px] font-black uppercase">{playersNeeded} needed</Text>
            </View>
            {isHost && (
              <TouchableOpacity 
                onPress={() => onDelete(id)}
                className="w-8 h-8 rounded-full bg-red-500/10 items-center justify-center border border-red-500/20"
              >
                <MaterialCommunityIcons name="trash-can-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text className="text-white text-lg font-black uppercase mb-1 tracking-tighter">
          {role} Needed
        </Text>

        {description ? (
          <Text className="text-[#A1A1AA] text-[10px] mb-2 leading-3" numberOfLines={1}>
            {description}
          </Text>
        ) : null}

        <View className="flex-row items-center gap-2 flex-wrap">
          <View className="flex-row items-center bg-[#1a1a1a] px-2 py-1 rounded-xl border border-white/5">
            <Feather name="bar-chart-2" size={10} color="#fbbf24" />
            <Text className="text-[#A1A1AA] text-[9px] font-bold ml-1.5 uppercase tracking-wide">
              {level}
            </Text>
          </View>
          <View className="flex-row items-center bg-[#1a1a1a] px-2 py-1 rounded-xl border border-white/5">
            <Feather name="clock" size={10} color="#666" />
            <Text className="text-[#A1A1AA] text-[9px] font-bold ml-1.5 uppercase tracking-wide">
              {formattedDate}, {time}
            </Text>
          </View>
          {contactNumber && contactNumber !== "Not Provided" && (
            <View className="flex-row items-center bg-[#1a1a1a] px-2 py-1 rounded-xl border border-white/5">
              <Feather name="phone" size={10} color="#fbbf24" />
              <Text className="text-[#A1A1AA] text-[9px] font-bold ml-1.5 uppercase tracking-wide">
                {contactNumber}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row mt-2">
        <TouchableOpacity 
          disabled={applying}
          onPress={async () => {
            setApplying(true);
            await onApply(id);
            setApplying(false);
          }}
          className={`flex-1 ${applying ? 'bg-amber-400/50' : 'bg-amber-400'} h-9 rounded-xl items-center justify-center active:bg-amber-500`}
        >
          {applying ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Text className="text-black font-black uppercase text-[9px] tracking-widest">Apply Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FilterChip = ({ label, selected, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(label)}
    activeOpacity={0.7}
    className={`px-3 py-1.5 rounded-lg border mr-1.5 ${
      selected ? "bg-amber-400 border-amber-400" : "bg-[#111] border-white/5"
    }`}
  >
    <Text className={`text-[9px] font-black uppercase tracking-tight ${selected ? "text-black" : "text-white/40"}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const PlayersTab = () => {
  const router = useRouter();
  const [recruitments, setRecruitments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    role: null,
    level: null,
  });

  const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });
  const [showSuccess, setShowSuccess] = useState({ visible: false, message: "", title: "Success", type: "success" });

  const roles = ["Attacker", "Midfielder", "Defender", "Goalkeeper"];
  const levels = ["Casual", "Intermediate", "Competitive", "Pro"];

  const loadRecruitments = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const params = {};
      if (filters.role) params.role = filters.role;
      if (filters.level) params.level = filters.level;
      
      const [recruitmentRes, userRes] = await Promise.all([
        fetchRecruitments(params),
        currentUser ? Promise.resolve({ data: currentUser }) : fetchUserProfile(),
      ]);

      setRecruitments(recruitmentRes.data);
      setCurrentUser(userRes.data);
    } catch (error) {
      console.error("Error fetching recruitments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, currentUser]);

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
      setShowSuccess({ 
        visible: true, 
        title: "Application Sent!", 
        message: "Your application has been successfully submitted.",
        type: "success"
      });
    } catch (error) {
      console.error("Error applying:", error);
      
      if (error.response?.status === 400 && error.response?.data?.message?.toLowerCase().includes("already applied")) {
        setShowSuccess({ 
          visible: true, 
          title: "Already Applied", 
          message: "You have already sent an application for this recruitment post.",
          type: "info"
        });
      } else {
        const message = error.response?.data?.message || "Failed to send application";
        Alert.alert("Error", message);
      }
    }
  };

  const proceedDelete = async () => {
    try {
      setLoading(true);
      await deleteRecruitment(confirmDelete.id);
      setConfirmDelete({ visible: false, id: null });
      setShowSuccess({ visible: true, message: "Requirement removed successfully." });
      loadRecruitments(false);
    } catch (error) {
      console.error("Error deleting recruitment:", error);
      Alert.alert("Error", "Failed to delete recruitment post.");
      setConfirmDelete({ visible: false, id: null });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setConfirmDelete({ visible: true, id });
  };

  return (
    <>
      <View className="flex-1">
        {/* Filter Section */}
        <View className="px-6 py-5 border-b border-white/5 bg-black">
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-[10px] font-black uppercase text-amber-400 tracking-[3px] mb-1">Players Hub</Text>
              <Text className="text-xl font-black text-white uppercase tracking-tight">Recruitments</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push("/players-recruit/post-need")}
              activeOpacity={0.8}
              className="flex-row items-center bg-amber-400 px-4 py-2.5 rounded-2xl shadow-lg"
            >
              <MaterialIcons name="add" size={16} color="black" />
              <Text className="text-black font-black uppercase text-[10px] tracking-widest ml-1">Post Need</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row items-center gap-2">
              <FilterChip 
                label="All Roles" 
                selected={!filters.role} 
                onSelect={() => toggleFilter('role', null)} 
              />
              {roles.map(role => (
                <FilterChip 
                  key={`role-${role}`}
                  label={role}
                  selected={filters.role === role}
                  onSelect={(val) => toggleFilter('role', val)}
                />
              ))}
              
              <View className="w-[1px] h-4 bg-white/10 mx-1" />
              
              <FilterChip 
                label="All Levels" 
                selected={!filters.level} 
                onSelect={() => toggleFilter('level', null)} 
              />
              {levels.map(level => (
                <FilterChip 
                  key={`level-${level}`}
                  label={level}
                  selected={filters.level === level}
                  onSelect={(val) => toggleFilter('level', val)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbbf24" />
          }
        >
          <View className="pt-6 pb-44">
            {loading ? (
              <ActivityIndicator color="#fbbf24" size="large" className="mt-10" />
            ) : recruitments.length > 0 ? (
              recruitments.map(item => (
                <PlayerCard 
                  key={item.id} 
                  recruitment={item} 
                  onApply={handleApply}
                  onDelete={handleDeleteRequest}
                  isHost={currentUser?.id === item.hostId}
                />
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

      <ConfirmModal
        visible={confirmDelete.visible}
        title="Remove Requirement?"
        message="This will permanently delete this player recruitment post. This action cannot be undone."
        confirmText="DELETE"
        confirmDestructive={true}
        onCancel={() => setConfirmDelete({ visible: false, id: null })}
        onConfirm={proceedDelete}
        loading={loading}
      />

      <SuccessModal
        visible={showSuccess.visible}
        title={showSuccess.title}
        message={showSuccess.message}
        type={showSuccess.type}
        onClose={() => setShowSuccess({ ...showSuccess, visible: false })}
      />
    </>
  );
};

export default PlayersTab;
