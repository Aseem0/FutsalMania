import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchMatches } from "../../services/api";

export default function ExploreScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("All");

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

  // Advanced Filtering Logic
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

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <View className="flex-1 max-w-md mx-auto w-full border-x border-white/5">
        {/* Header Area with Search */}
        <View className="px-6 pt-4 pb-4 bg-black">
          <View className="flex-row items-center justify-between mb-6">
            <View className="w-10" />
            <Text className="text-xl font-black uppercase tracking-tight text-white">
              Explore Games
            </Text>
            <TouchableOpacity
              onPress={loadMatches}
              className="w-10 h-10 items-center justify-center rounded-full bg-[#111] border border-white/5"
            >
              <MaterialCommunityIcons
                name="refresh"
                size={20}
                color={loading ? "rgba(255,255,255,0.2)" : "#fbbf24"}
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-[#111] border border-white/10 rounded-2xl px-4 py-3 mb-4">
            <MaterialIcons name="search" size={20} color="#666" />
            <TextInput
              placeholder="Search Arenas or Locations..."
              placeholderTextColor="#666"
              className="flex-1 ml-3 text-white font-medium"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialIcons name="close" size={18} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filters Row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {/* Format Filters */}
            <View className="flex-row border-r border-white/10 pr-4 mr-4 gap-2">
              {formats.map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setSelectedFormat(f)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedFormat === f ? "bg-amber-400 border-amber-400" : "bg-transparent border-white/10"
                  }`}
                >
                  <Text className={`text-[10px] font-black uppercase ${selectedFormat === f ? "text-black" : "text-white/40"}`}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Skill Filters */}
            <View className="flex-row gap-2">
              {skillLevels.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSelectedSkill(s)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedSkill === s ? "bg-amber-400 border-amber-400" : "bg-transparent border-white/10"
                  }`}
                >
                  <Text className={`text-[10px] font-black uppercase ${selectedSkill === s ? "text-black" : "text-white/40"}`}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <ScrollView
          className="flex-1 px-5 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {loading && matches.length === 0 ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator color="#FFB300" />
              <Text className="text-white/40 mt-4 font-bold">
                Scouting the area...
              </Text>
            </View>
          ) : filteredMatches.length === 0 ? (
            <View className="py-20 items-center justify-center border border-[#1F1F1F] rounded-2xl bg-[#111] px-10">
              <MaterialCommunityIcons
                name="magnify-close"
                size={64}
                color="rgba(255,255,255,0.05)"
              />
              <Text className="text-white/60 mt-6 font-bold text-center">
                {searchQuery || selectedFormat !== "All" || selectedSkill !== "All" 
                  ? "No games match your filters." 
                  : "No public matches found. Why not host one?"}
              </Text>
              {(searchQuery || selectedFormat !== "All" || selectedSkill !== "All") && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    setSelectedFormat("All");
                    setSelectedSkill("All");
                  }}
                  className="mt-6"
                >
                  <Text className="text-amber-400 font-bold uppercase text-[10px] tracking-widest">
                    Clear All Filters
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="gap-6 pb-20">
              <View className="flex-row justify-between items-center ml-1">
                <Text className="text-white/40 text-[10px] font-black uppercase tracking-[3px]">
                  {filteredMatches.length} Public Sessions
                </Text>
                {(searchQuery || selectedFormat !== "All" || selectedSkill !== "All") && (
                  <TouchableOpacity onPress={() => {
                    setSearchQuery("");
                    setSelectedFormat("All");
                    setSelectedSkill("All");
                  }}>
                    <Text className="text-amber-400 text-[9px] font-black uppercase">Reset</Text>
                  </TouchableOpacity>
                )}
              </View>

              {filteredMatches.map((match) => (
                <TouchableOpacity
                  key={match.id}
                  activeOpacity={0.9}
                  onPress={() => router.push({
                    pathname: "/(matches)/match-details",
                    params: { id: match.id }
                  })}
                  className="relative w-full h-64 rounded-3xl overflow-hidden border border-white/5 shadow-2xl"
                >
                  <Image
                    source={{
                      uri:
                        match.arena?.image ||
                        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
                    }}
                    className="absolute inset-0 w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black/60" />

                  <View className="relative h-full flex-col justify-between p-6">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 mr-4">
                        <View className="flex-row items-center mb-1">
                          <MaterialIcons name="place" size={12} color="#fbbf24" />
                          <Text
                            className="text-amber-400 text-[10px] font-black uppercase tracking-widest ml-1"
                            numberOfLines={1}
                          >
                            {match.arena?.location || "Kathmandu"}
                          </Text>
                        </View>
                        <Text
                          className="font-black text-2xl text-white leading-none"
                          numberOfLines={1}
                        >
                          {match.arena?.name || "Premium Futsal"}
                        </Text>
                        <Text
                          className="text-xs text-white/50 font-bold mt-1"
                          numberOfLines={1}
                        >
                          Hosted by {match.host?.username || "Player"}
                        </Text>
                      </View>
                      <View className="px-3 py-1.5 rounded-xl border border-white/10 bg-black/80 blur-lg">
                        <Text className="text-[10px] font-black text-white tracking-widest">
                          {formatDate(match.date)}
                        </Text>
                      </View>
                    </View>

                    <View className="gap-5">
                      <View className="flex-row items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                        <View className="flex-row items-center gap-2">
                          <MaterialCommunityIcons
                            name="clock-outline"
                            size={18}
                            color="#FFB300"
                          />
                          <Text className="text-md text-white font-black tracking-tight">
                            {match.time}
                          </Text>
                        </View>
                        <View className="px-3 py-1 rounded-full bg-amber-400">
                          <Text className="text-[10px] font-black text-black uppercase">
                            {match.format} • {match.skillLevel}
                          </Text>
                        </View>
                      </View>

                      <View className="gap-2">
                        <View className="flex-row justify-between px-1">
                          <Text className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                            Join Squad
                          </Text>
                          <Text className="text-[10px] font-black uppercase text-amber-400 tracking-widest">
                            {match.currentPlayers} / {match.maxPlayers} Spots
                          </Text>
                        </View>
                        <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <View
                            className="bg-amber-400 h-full rounded-full"
                            style={{
                              width: `${
                                (match.currentPlayers / match.maxPlayers) * 100
                              }%`,
                            }}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Join Button Placeholder - Removed since the whole card is now clickable */}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
