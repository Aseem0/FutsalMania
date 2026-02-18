import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchArenas } from "../../services/api";

/**
 * ArenaStep Component
 * Allows users to browse and select a futsal arena from the backend.
 */
export default function ArenaStep({ selectedArena, onSelect }) {
  const [arenas, setArenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArenas();
  }, []);

  const loadArenas = async () => {
    try {
      setLoading(true);
      const response = await fetchArenas();
      setArenas(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load arenas:", err);
      setError("Unable to load arenas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text className="text-white/40 mt-4 font-bold">
          Finding best courts...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-10">
        <MaterialIcons
          name="error-outline"
          size={48}
          color="rgba(255,255,255,0.2)"
        />
        <Text className="text-white/60 text-center mt-4 font-bold">
          {error}
        </Text>
        <TouchableOpacity
          onPress={loadArenas}
          className="mt-6 bg-amber-400 px-6 py-3 rounded-xl"
        >
          <Text className="text-black font-black uppercase text-xs">
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 px-6 pb-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="mt-4">
        <Text className="text-2xl font-black mb-2 text-white">
          Select Arena
        </Text>
        <Text className="text-white/50 text-sm mb-8 font-medium">
          Choose a premium court from our curated list.
        </Text>
      </View>

      {/* Search Bar */}
      <View className="relative mb-8">
        <MaterialIcons
          name="search"
          size={20}
          color="rgba(255,255,255,0.3)"
          style={{ position: "absolute", left: 16, top: 16, zIndex: 1 }}
        />
        <TextInput
          className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white"
          placeholder="Search arenas..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          style={{ outlineStyle: "none" }}
        />
      </View>

      {/* Arena List */}
      <View className="gap-4">
        {arenas.map((arena) => (
          <TouchableOpacity
            key={arena.id}
            onPress={() => onSelect(arena)}
            activeOpacity={0.8}
            className={`p-3 rounded-2xl flex-row gap-4 items-center border ${
              selectedArena?.id === arena.id
                ? "bg-amber-400/5 border-amber-400"
                : "bg-[#111] border-white/5"
            }`}
          >
            <View className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
              <Image
                source={{ uri: arena.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className="flex-1">
              <View className="flex-row justify-between items-start">
                <Text className="font-bold text-white text-md">
                  {arena.name}
                </Text>
                <View className="flex-row items-center">
                  <MaterialIcons name="star" size={12} color="#fbbf24" />
                  <Text className="text-xs ml-1 font-black text-amber-400">
                    {arena.rating}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center mt-1">
                <MaterialIcons
                  name="place"
                  size={12}
                  color="rgba(255,255,255,0.4)"
                />
                <Text className="text-white/40 text-xs ml-1 font-medium">
                  {arena.location}
                </Text>
              </View>

              <View className="mt-2 bg-amber-400/10 px-2 py-0.5 rounded-full self-start">
                <Text className="text-amber-400 text-[10px] font-black uppercase tracking-wider">
                  {arena.distance}
                </Text>
              </View>
            </View>

            {selectedArena?.id === arena.id && (
              <View className="absolute top-2 right-2 bg-amber-400 rounded-full w-5 h-5 items-center justify-center">
                <MaterialIcons name="check" size={14} color="#000000" />
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View className="py-8">
          <Text className="text-white/20 text-[10px] uppercase tracking-[3px] font-black text-center">
            {arenas.length} venues available
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
