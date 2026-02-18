import React from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * GameSettings Component
 * Allows users to configure match format, player limits, skill levels, and pricing.
 */
export default function GameSettings({ settings, onUpdate }) {
  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Pro"];
  const formats = ["5v5", "6v6", "7v7", "8v8", "Others"];

  const updateSetting = (key, value) => onUpdate({ [key]: value });

  const adjustPlayers = (amount) => {
    const current = settings.maxPlayers || 10;
    const next = Math.max(2, Math.min(22, current + amount));
    updateSetting('maxPlayers', next);
  };

  // Reusable Section Header
  const SectionLabel = ({ title }) => (
    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">
      {title}
    </Text>
  );

  // Reusable Chip Component
  const SelectChip = ({ label, value, active, onPress, large = false }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`rounded-2xl border ${large ? 'px-5 py-3' : 'px-4 py-3'} ${
        active ? "bg-amber-400 border-amber-400" : "bg-[#111] border-white/5"
      }`}
    >
      <Text className={`text-xs ${active ? "text-black font-black" : "text-white/60 font-bold"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-8">
        <Text className="text-2xl font-black text-white mb-2">Game Settings</Text>
        <Text className="text-white/50 text-sm font-medium">
          Configure gameplay rules and player limits.
        </Text>
      </View>

      {/* Match Format */}
      <View className="mb-8">
        <SectionLabel title="Match Format" />
        <View className="flex-row flex-wrap gap-2">
          {formats.map((f) => (
            <SelectChip
              key={f}
              label={f}
              active={settings.format === f}
              onPress={() => updateSetting('format', f)}
              large
            />
          ))}
        </View>
      </View>

      {/* Player Limit */}
      <View className="mb-8">
        <SectionLabel title="Player Limit" />
        <View className="flex-row items-center justify-between bg-[#111] p-4 rounded-2xl border border-white/5">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-amber-400/10 items-center justify-center">
              <MaterialIcons name="groups" size={20} color="#fbbf24" />
            </View>
            <Text className="text-white font-bold">Max Players</Text>
          </View>
          
          <View className="flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={() => adjustPlayers(-1)}
              className="w-8 h-8 rounded-full bg-white/5 items-center justify-center border border-white/10"
            >
              <MaterialIcons name="remove" size={18} color="white" />
            </TouchableOpacity>
            
            <Text className="text-xl font-black text-white w-6 text-center">
              {settings.maxPlayers || 10}
            </Text>
            
            <TouchableOpacity 
              onPress={() => adjustPlayers(1)}
              className="w-8 h-8 rounded-full bg-amber-400 items-center justify-center"
            >
              <MaterialIcons name="add" size={18} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Skill Level */}
      <View className="mb-8">
        <SectionLabel title="Required Skill Level" />
        <View className="flex-row flex-wrap gap-2">
          {skillLevels.map((l) => (
            <SelectChip
              key={l}
              label={l}
              active={settings.skillLevel === l}
              onPress={() => updateSetting('skillLevel', l)}
            />
          ))}
        </View>
      </View>

      {/* Price per Player */}
      <View className="mb-8">
        <SectionLabel title="Price per Player (NPR)" />
        <View className="flex-row items-center bg-[#111] p-4 rounded-2xl border border-white/5">
          <MaterialCommunityIcons name="currency-usd" size={20} color="#fbbf24" />
          <TextInput
            placeholder="0"
            placeholderTextColor="rgba(255,255,255,0.2)"
            keyboardType="numeric"
            value={settings.price?.toString()}
            onChangeText={(val) => updateSetting('price', parseInt(val) || 0)}
            className="flex-1 ml-3 text-white font-black text-lg"
          />
        </View>
      </View>
    </ScrollView>
  );
}
