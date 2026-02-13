import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SelectionCard({ 
  label, 
  icon, 
  isSelected, 
  onPress, 
  type = 'card' // 'card' or 'pill'
}) {
  if (type === 'pill') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className={`h-14 items-center justify-center rounded-2xl px-6 border-2 ${
          isSelected ? "bg-amber-400 border-amber-400" : "bg-zinc-900/40 border-white/5"
        }`}
      >
        <Text className={`text-[14px] font-black ${isSelected ? "text-black" : "text-white/90"}`}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  // Default Card style
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`flex-col items-center justify-center p-6 rounded-[32px] h-40 border-2 ${
        isSelected ? "bg-amber-400 border-amber-400" : "bg-zinc-900/40 border-white/5"
      }`}
    >
      <View className={`w-14 h-14 rounded-full items-center justify-center mb-4 ${
        isSelected ? "bg-black/5" : "bg-white/5"
      }`}>
        <Ionicons name={icon} size={28} color={isSelected ? "#000" : "#fff"} />
      </View>
      <Text className={`text-[14px] font-black tracking-tight ${isSelected ? "text-black" : "text-white/90"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
