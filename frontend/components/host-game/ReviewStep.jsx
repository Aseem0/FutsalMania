import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * ReviewStep Component
 * Provides a final summary of all selected game details before posting.
 */
export default function ReviewStep({ gameData, onEdit }) {
  const { arena, details, settings } = gameData;

  // Reusable Section Header with Edit Button
  const SectionHeader = ({ title, icon, step }) => (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center gap-2">
        <MaterialIcons name={icon} size={16} color="#fbbf24" />
        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px]">
          {title}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={() => onEdit(step)}
        activeOpacity={0.7}
        className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5"
      >
        <Text className="text-amber-400 text-[10px] font-black uppercase tracking-wider">Edit</Text>
      </TouchableOpacity>
    </View>
  );

  // Formatting date for display
  const displayDate = details.date 
    ? new Date(details.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Not set';

  return (
    <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
      <View className="mb-8">
        <Text className="text-2xl font-black text-white mb-2">Review & Post</Text>
        <Text className="text-white/50 text-sm font-medium">
          Double check everything before hitting the pitch.
        </Text>
      </View>

      {/* Arena Summary */}
      <View className="mb-8">
        <SectionHeader title="Arena" icon="place" step={1} />
        <View className="bg-[#111] p-3 rounded-2xl border border-white/10 flex-row gap-4 items-center">
          <View className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900">
            <Image
              source={{ uri: arena?.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-md">{arena?.name || 'No Arena Selected'}</Text>
            <Text className="text-white/40 text-xs mt-1">{arena?.location || 'Unknown location'}</Text>
          </View>
        </View>
      </View>

      {/* Schedule Summary */}
      <View className="mb-8">
        <SectionHeader title="Schedule" icon="event" step={2} />
        <View className="bg-[#111] p-5 rounded-2xl border border-white/10 flex-row justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-amber-400/10 items-center justify-center">
              <MaterialIcons name="calendar-today" size={18} color="#fbbf24" />
            </View>
            <View>
              <Text className="text-white/40 text-[9px] font-bold uppercase">Date</Text>
              <Text className="text-white font-bold">{displayDate}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-amber-400/10 items-center justify-center">
              <MaterialIcons name="access-time" size={18} color="#fbbf24" />
            </View>
            <View>
              <Text className="text-white/40 text-[9px] font-bold uppercase">Time</Text>
              <Text className="text-white font-bold">{details.time || 'Not set'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Settings Summary */}
      <View className="mb-10">
        <SectionHeader title="Settings" icon="settings" step={3} />
        <View className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
          {/* Format & Players */}
          <View className="flex-row border-b border-white/5">
            <View className="flex-1 p-4 border-r border-white/5">
              <Text className="text-white/40 text-[9px] font-bold uppercase mb-1">Format</Text>
              <Text className="text-white font-black">{settings.format || '5v5'}</Text>
            </View>
            <View className="flex-1 p-4">
              <Text className="text-white/40 text-[9px] font-bold uppercase mb-1">Max Players</Text>
              <Text className="text-white font-black">{settings.maxPlayers || 10} Slots</Text>
            </View>
          </View>
          
          {/* Skill & Price */}
          <View className="flex-row">
            <View className="flex-1 p-4 border-r border-white/5">
              <Text className="text-white/40 text-[9px] font-bold uppercase mb-1">Skill Level</Text>
              <Text className="text-white font-black">{settings.skillLevel || 'Any'}</Text>
            </View>
            <View className="flex-1 p-4">
              <Text className="text-white/40 text-[9px] font-bold uppercase mb-1">Price</Text>
              <Text className="text-amber-400 font-black">
                {settings.price > 0 ? `NPR ${settings.price}` : 'FREE'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
