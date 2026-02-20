import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchMatches } from "../../services/api";

const GamesTab = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("All");

  const formats = ["All", "5v5", "6v6", "7v7"];
  const skillLevels = ["All", "Beginner", "Intermediate", "Advanced", "Pro"];

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

  return (
    <>
      <View className="px-6 mb-6">
        {/* Modern Search Bar */}
        <View className="bg-[#121212] border border-[#1f1f1f] rounded-2xl mb-4 shadow-sm overflow-hidden flex-row items-center px-4 h-14">
          <Feather name="search" size={18} color="#FFB300" />
          <TextInput
            placeholder="Find your next arena..."
            placeholderTextColor="#4b5563"
            className="flex-1 ml-3 text-white text-sm font-medium"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x-circle" size={16} color="#4b5563" />
            </TouchableOpacity>
          )}
        </View>

        {/* Single Line Scrollable Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {formats.map(f => (
              <TouchableOpacity 
                key={`format-${f}`}
                onPress={() => setSelectedFormat(f)}
                className={`px-5 py-2.5 rounded-xl border ${selectedFormat === f ? 'bg-amber-400 border-amber-400' : 'bg-[#121212] border-[#1f1f1f]'}`}
              >
                <Text className={`text-[10px] font-black uppercase tracking-widest ${selectedFormat === f ? 'text-black' : 'text-[#A1A1AA]'}`}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}

            <View className="w-[1px] h-6 bg-[#1f1f1f] self-center mx-1" />

            {skillLevels.map(s => (
              <TouchableOpacity 
                key={`skill-${s}`}
                onPress={() => setSelectedSkill(s)}
                className={`px-5 py-2.5 rounded-xl border flex-row items-center ${selectedSkill === s ? 'bg-amber-400 border-amber-400' : 'bg-[#121212] border-[#1f1f1f]'}`}
              >
                <Text className={`text-[10px] font-black uppercase tracking-widest ${selectedSkill === s ? 'text-black' : 'text-[#A1A1AA]'}`}>
                  {s}
                </Text>
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
  );
};

export default GamesTab;
