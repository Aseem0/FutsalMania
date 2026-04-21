import React from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

/**
 * GameSettings Component
 * Allows users to configure match format, player limits, skill levels, and pricing.
 */
export default function GameSettings({ settings, onUpdate, isTeamMatch = false, customTeamName = '', onUpdateCustomTeamName }) {
  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Pro"];
  const formats = ["5v5", "6v6", "7v7", "8v8", "Others"];
  const matchTypes = ["Friendly", "Competitive"];

  const updateSetting = (key, value) => onUpdate({ [key]: value });

  const adjustPlayers = (amount) => {
    const current = settings.maxPlayers || 10;
    const next = Math.max(2, Math.min(15, current + amount));
    updateSetting('maxPlayers', next);
  };

  // Reusable Section Header
  const SectionLabel = ({ title, icon }) => (
    <View className="flex-row items-center gap-2 mb-4 ml-1">
      {icon && <MaterialIcons name={icon} size={14} color="#fbbf24" />}
      <Text className="text-white/40 text-[10px] font-inter-bold uppercase tracking-[2px]">
        {title}
      </Text>
      {title === "Contact Number" && (
        <View className="bg-red-500/20 px-1.5 py-0.5 rounded border border-red-500/30">
          <Text className="text-red-500 text-[7px] font-inter-black uppercase">REQUIRED</Text>
        </View>
      )}
    </View>
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
      <Text className={`text-xs ${active ? "text-black font-inter-black" : "text-white/60 font-inter-bold"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-8">
        <Text className="text-2xl font-outfit-bold text-white mb-2 italic uppercase tracking-tighter">Game Settings</Text>
        <Text className="text-white/50 text-sm font-inter-medium">
          {isTeamMatch ? "Configure your team's challenge parameters." : "Configure gameplay rules and player limits."}
        </Text>
      </View>

      {/* Your Team Name (Team Specific) */}
      {isTeamMatch && (
        <View className="mb-10">
          <SectionLabel title="Your Team Name" icon="shield" />
          <View className="bg-[#111] p-4 rounded-2xl border border-white/5 flex-row items-center">
            <FontAwesome5 name="shield-alt" size={18} color="#fbbf24" className="mr-3" />
            <TextInput
              placeholder="e.g., My Squad, The Dragons..."
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={customTeamName}
              onChangeText={onUpdateCustomTeamName}
              className="flex-1 ml-3 text-white font-inter-black text-lg"
              style={Platform.OS === 'web' ? { outlineWidth: 0 } : {}}
            />
          </View>
          <Text className="text-white/20 text-[9px] font-inter-bold uppercase mt-2 ml-1 italic">
            This name will be shown in the match summary.
          </Text>
        </View>
      )}

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

      {/* Match Type (Team Specific) */}
      {isTeamMatch && (
        <View className="mb-8">
          <SectionLabel title="Match Type" />
          <View className="flex-row flex-wrap gap-2">
            {matchTypes.map((t) => (
              <SelectChip
                key={t}
                label={t}
                active={settings.matchType === t}
                onPress={() => updateSetting('matchType', t)}
                large
              />
            ))}
          </View>
        </View>
      )}

      {/* Player Limit (Hidden for Team Match) */}
      {!isTeamMatch && (
        <View className="mb-8">
          <SectionLabel title="Player Limit" />
          <View className="flex-row items-center justify-between bg-[#111] p-4 rounded-2xl border border-white/5">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-amber-400/10 items-center justify-center">
                <MaterialIcons name="groups" size={20} color="#fbbf24" />
              </View>
              <Text className="text-white font-inter-bold">Max Players</Text>
            </View>
            
            <View className="flex-row items-center gap-4">
              <TouchableOpacity 
                onPress={() => adjustPlayers(-1)}
                className="w-8 h-8 rounded-full bg-white/5 items-center justify-center border border-white/10"
              >
                <MaterialIcons name="remove" size={18} color="white" />
              </TouchableOpacity>
              
              <Text className="text-xl font-inter-black text-white w-6 text-center">
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
      )}

      {/* Skill Level */}
      <View className="mb-8">
        <SectionLabel title={isTeamMatch ? "Minimum Opponent Skill" : "Required Skill Level"} />
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

      {/* Price per Player (Hidden for Team Match) */}
      {!isTeamMatch && (
        <View className="mb-10">
          <SectionLabel title="Price per Player (NPR)" />
          <View className="flex-row items-center bg-[#111] p-4 rounded-2xl border border-white/5">
            <MaterialCommunityIcons name="currency-usd" size={20} color="#fbbf24" />
            <TextInput
              placeholder="0"
              placeholderTextColor="rgba(255,255,255,0.2)"
              keyboardType="numeric"
              value={settings.price?.toString()}
              onChangeText={(val) => updateSetting('price', parseInt(val) || 0)}
              className="flex-1 ml-3 text-white font-inter-black text-lg"
              style={Platform.OS === 'web' ? { outlineWidth: 0 } : {}}
            />
          </View>
        </View>
      )}

      {/* Contact Number */}
      <View className="mb-10">
        <SectionLabel title="Contact Number" icon="phone" />
        <View className="bg-[#111] p-4 rounded-2xl border border-white/5 flex-row items-center">
          <MaterialIcons name="phone" size={18} color="#fbbf24" className="mr-3" />
          <TextInput
            placeholder="e.g., +977 98XXXXXXXX"
            placeholderTextColor="rgba(255,255,255,0.2)"
            keyboardType="phone-pad"
            value={settings.contactNumber}
            onChangeText={(val) => updateSetting('contactNumber', val)}
            className="flex-1 ml-3 text-white font-inter-black text-lg"
            style={Platform.OS === 'web' ? { outlineWidth: 0 } : {}}
          />
        </View>
        <Text className="text-white/20 text-[9px] font-inter-bold uppercase mt-2 ml-1 italic">
          This number will be visible to other players.
        </Text>
      </View>
    </ScrollView>
  );
}
