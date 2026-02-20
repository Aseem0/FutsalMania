import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PlayerCard = ({ name, team, role, level, time, timeRemaining, initials, logo }) => (
  <View className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-5 mb-4 shadow-sm">
    {/* Top Section: Avatar & Host Info */}
    <View className="flex-row justify-between items-start mb-3">
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${logo ? 'bg-[#064e3b]' : 'bg-[#1e1b4b]'}`}>
          {logo ? (
            <MaterialCommunityIcons name="shield-check" size={20} color="#10b981" />
          ) : (
            <Text className="text-white text-xs font-black">{initials}</Text>
          )}
        </View>
        <View>
          <Text className="text-white text-sm font-bold tracking-tight">{name}</Text>
          <Text className="text-[#A1A1AA] text-[9px] font-bold uppercase tracking-wider">
            {team}
          </Text>
        </View>
      </View>
      <View className="bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
        <Text className="text-amber-400 text-[9px] font-black uppercase">{timeRemaining}</Text>
      </View>
    </View>

    {/* Role Title */}
    <Text className="text-white text-lg font-black uppercase mb-3 tracking-tighter">
      {role}
    </Text>

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
          {time}
        </Text>
      </View>
    </View>

    {/* Action Buttons */}
    <View className="flex-row">
      <TouchableOpacity className="flex-1 bg-amber-400 h-11 rounded-xl items-center justify-center active:bg-amber-500">
        <Text className="text-black font-black uppercase text-[10px] tracking-widest">Apply Now</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const PlayersTab = () => {
  const router = useRouter();
  return (
    <>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="pb-32">
          <PlayerCard 
            name="Marcus Thompson"
            team="FC TITANS"
            role="Goalkeeper Needed"
            level="Competitive"
            time="Today, 20:00"
            timeRemaining="02:45:12"
            initials="MT"
          />
        </View>
      </ScrollView>

      {/* Floating Action Button - Only in PLAYERS tab */}
      <TouchableOpacity 
        onPress={() => router.push("/post-player-need")}
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
