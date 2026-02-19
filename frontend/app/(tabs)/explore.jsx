import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchMatches } from "../../services/api";

export default function ExploreScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("GAMES");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);

  // Search and Filter States (for Games)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("All");

  const tabs = ["GAMES", "PLAYERS", "TEAMS"];
  const formats = ["All", "5v5", "6v6", "7v7"];
  const skillLevels = ["All", "Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await fetchMatches();
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchesSearch = 
        match.arena?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.arena?.location?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFormat = selectedFormat === "All" || match.format === selectedFormat;
      const matchesSkill = selectedSkill === "All" || match.skillLevel === selectedSkill;

      return matchesSearch && matchesFormat && matchesSkill;
    });
  }, [matches, searchQuery, selectedFormat, selectedSkill]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "TODAY";

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return "TOMORROW";

    return date
      .toLocaleDateString("en-US", { weekday: "short", day: "numeric" })
      .toUpperCase();
  };

  const PlayerCard = ({ name, team, role, level, time, timeRemaining, initials, logo }) => (
    <View className="bg-[#111] border border-white/5 rounded-[32px] p-6 mb-4">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center">
          <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${logo ? 'bg-[#1a2e2a]' : 'bg-[#2a3447]'}`}>
            {logo ? (
              <MaterialCommunityIcons name="shield-outline" size={24} color="#10b981" />
            ) : (
              <Text className="text-white font-bold">{initials}</Text>
            )}
          </View>
          <View>
            <Text className="text-white text-lg font-bold">{name}</Text>
            <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
              HOST • {team}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Time Remaining</Text>
          <Text className="text-amber-400 font-bold">{timeRemaining}</Text>
        </View>
      </View>

      <Text className="text-amber-400 text-2xl font-black italic uppercase mb-4 tracking-tighter">
        {role}
      </Text>

      <View className="flex-row items-center mb-6 gap-4">
        <View className="flex-row items-center">
          <Feather name="trending-up" size={14} color="#666" />
          <Text className="text-white/60 text-xs font-bold ml-2">Level: <Text className="text-white">{level}</Text></Text>
        </View>
        <View className="flex-row items-center">
          <Feather name="clock" size={14} color="#666" />
          <Text className="text-white/60 text-xs font-bold ml-2">{time}</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity className="flex-1 bg-amber-400 h-14 rounded-2xl items-center justify-center">
          <Text className="text-black font-black uppercase tracking-widest">Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-14 h-14 bg-[#1a1a1a] border border-white/10 rounded-2xl items-center justify-center">
          <MaterialCommunityIcons name="chat-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header */}
        <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
          <Text className="text-3xl font-black text-white">Explore</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="w-12 h-12 bg-[#111] rounded-full items-center justify-center">
              <Feather name="search" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-12 h-12 bg-[#111] rounded-full items-center justify-center">
              <Feather name="bell" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row px-6 mb-6">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="flex-1 items-center py-4"
            >
              <Text className={`font-black text-xs tracking-widest ${activeTab === tab ? 'text-white' : 'text-white/20'}`}>
                {tab}
              </Text>
              {activeTab === tab && (
                <View className="absolute bottom-0 w-1/2 h-[3px] bg-amber-400 rounded-full" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters & Content Area */}
        <View className="flex-1 w-full">
          {activeTab === "GAMES" ? (
            <>
              <View className="px-6 mb-4">
                <View className="flex-row items-center bg-[#111] border border-white/10 rounded-2xl px-4 py-3 mb-4">
                  <MaterialIcons name="search" size={20} color="#666" />
                  <TextInput
                    placeholder="Search Arenas..."
                    placeholderTextColor="#666"
                    className="flex-1 ml-3 text-white font-medium"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {formats.map(f => (
                      <TouchableOpacity 
                        key={f}
                        onPress={() => setSelectedFormat(f)}
                        className={`px-5 py-3 rounded-full ${selectedFormat === f ? 'bg-amber-400' : 'bg-[#111] border border-white/10'}`}
                      >
                        <Text className={selectedFormat === f ? 'text-black font-bold' : 'text-white font-bold'}>{f}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {loading ? (
                  <ActivityIndicator color="#FFB300" className="mt-10" />
                ) : (
                  <View className="gap-6 pb-32">
                    {filteredMatches.map((match) => (
                      <TouchableOpacity
                        key={match.id}
                        activeOpacity={0.9}
                        onPress={() => router.push({
                          pathname: "/(matches)/match-details",
                          params: { id: match.id }
                        })}
                        className="relative w-full h-64 rounded-3xl overflow-hidden border border-white/5"
                      >
                        <Image
                          source={{ uri: match.arena?.image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop" }}
                          className="absolute inset-0 w-full h-full"
                          resizeMode="cover"
                        />
                        <View className="absolute inset-0 bg-black/60" />
                        <View className="p-6 justify-between h-full">
                          <View className="flex-row justify-between items-start">
                            <View>
                              <Text className="text-white text-2xl font-black">{match.arena?.name || "Premium Futsal"}</Text>
                              <Text className="text-white/50 text-xs font-bold">{match.arena?.location || "Kathmandu"}</Text>
                            </View>
                            <View className="bg-black/80 px-3 py-1.5 rounded-xl border border-white/10">
                              <Text className="text-white text-[10px] font-black uppercase tracking-widest">
                                {formatDate(match.date)}
                              </Text>
                            </View>
                          </View>
                          <View className="flex-row items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                             <View className="flex-row items-center gap-2">
                               <MaterialCommunityIcons name="clock-outline" size={18} color="#FFB300" />
                               <Text className="text-white font-black">{match.time}</Text>
                             </View>
                             <View className="bg-amber-400 px-3 py-1 rounded-full">
                               <Text className="text-black text-[10px] font-black uppercase">{match.format} • {match.skillLevel}</Text>
                             </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </ScrollView>
            </>
          ) : activeTab === "PLAYERS" ? (
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
                <PlayerCard 
                  name="Alex Rodriguez"
                  team="STREET KINGS"
                  role="Pivot Wanted"
                  level="Semi-Pro"
                  time="Tomorrow, 10:00"
                  timeRemaining="05:12:44"
                  logo={true}
                />
                 <PlayerCard 
                  name="Sarah Jenkins"
                  team="QUEENS UNITED"
                  role="Ala (Winger)"
                  level="Casual"
                  time="Sat, 18:30"
                  timeRemaining="12:20:01"
                  initials="SJ"
                />
              </View>
            </ScrollView>

            {/* Floating Action Button - Only in PLAYERS tab */}
            <TouchableOpacity 
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
        ) : (
            <View className="items-center justify-center py-20 flex-1">
               <Text className="text-white/20 font-bold uppercase tracking-widest">{activeTab} Section Coming Soon</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
