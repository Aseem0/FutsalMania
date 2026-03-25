import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

/**
 * ReviewStep Component
 * Provides a final summary of all selected game details before posting.
 */
export default function ReviewStep({ gameData, onEdit, isTeamMatch = false }) {
  const { arena, details, settings, team } = gameData;

  // Reusable Section Header with Edit Button
  const SectionHeader = ({ title, icon, step }) => (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center gap-2">
        <MaterialIcons name={icon} size={16} color="#fbbf24" />
        <Text className="text-white/40 text-[9px] font-black uppercase tracking-[2px]">
          {title}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={() => onEdit(step)}
        activeOpacity={0.7}
        className="bg-white/5 px-2.5 py-1 rounded-full border border-white/5"
      >
        <Text className="text-amber-400 text-[9px] font-black uppercase tracking-wider">Edit</Text>
      </TouchableOpacity>
    </View>
  );

  // Formatting date for display
  const displayDate = details.date 
    ? new Date(details.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Not set';

  if (isTeamMatch) {
    return (
      <View className="flex-1">
        <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
          <View className="mb-8">
            <Text className="text-2xl font-black text-white mb-2 uppercase italic italic-tighter tracking-tighter">Review Challenge</Text>
            <Text className="text-white/40 text-xs font-semibold">Your challenge will be broadcasted to all teams.</Text>
          </View>

          {/* VS Match Card */}
          <View className="bg-[#0A0A0A] border border-amber-400/20 rounded-[32px] p-6 mb-8 relative overflow-hidden shadow-2xl">
            {/* Background Accent */}
            <View className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/5 rounded-full blur-[60px]" />
            <View className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-[60px]" />

            <View className="flex-row items-center justify-between mb-8">
              {/* Home Team */}
              <View className="items-center flex-1">
                <View className="w-20 h-20 bg-amber-400/10 rounded-2xl items-center justify-center border-2 border-amber-400/20 mb-3 shadow-lg">
                  <FontAwesome5 name="shield-alt" size={32} color="#fbbf24" />
                </View>
                <Text className="text-white font-black uppercase tracking-tight text-center text-xs" numberOfLines={1}>
                  {gameData.customTeamName || team?.name || "PERSONAL HOST"}
                </Text>
                <Text className="text-amber-400/40 text-[8px] font-black uppercase mt-1 tracking-widest">ORGANIZER</Text>
              </View>

              {/* VS Badge */}
              <View className="px-4 py-2 bg-amber-400 rounded-full z-10 mx-2 shadow-xl shadow-amber-400/20">
                 <Text className="text-black font-black italic text-sm tracking-tighter">VS</Text>
              </View>

              {/* Away Team (Challenger) */}
              <View className="items-center flex-1">
                <View className="w-20 h-20 bg-white/5 rounded-2xl items-center justify-center border-2 border-white/5 mb-3 border-dashed">
                  <MaterialCommunityIcons name="help-circle-outline" size={32} color="rgba(255,255,255,0.1)" />
                </View>
                <Text className="text-white/20 font-black uppercase tracking-tight text-center text-xs" numberOfLines={1}>
                  WAITING...
                </Text>
                <Text className="text-white/10 text-[8px] font-black uppercase mt-1 tracking-widest">OPPONENT</Text>
              </View>
            </View>

            {/* Match Rules Bar */}
            <View className="flex-row justify-center gap-6 border-t border-white/5 pt-6">
                <View className="items-center">
                    <Text className="text-white/30 text-[8px] font-black uppercase tracking-widest mb-1">Format</Text>
                    <Text className="text-white font-black text-xs">{settings.format || '5v5'}</Text>
                </View>
                <View className="w-[1px] h-8 bg-white/5" />
                <View className="items-center">
                    <Text className="text-white/30 text-[8px] font-black uppercase tracking-widest mb-1">Type</Text>
                    <Text className="text-amber-400 font-black text-xs uppercase">{settings.matchType || 'Friendly'}</Text>
                </View>
                <View className="w-[1px] h-8 bg-white/5" />
                <View className="items-center">
                    <Text className="text-white/30 text-[8px] font-black uppercase tracking-widest mb-1">Min Level</Text>
                    <Text className="text-white font-black text-xs uppercase">{settings.skillLevel || 'Inter'}</Text>
                </View>
            </View>
          </View>

          {/* Details Sections */}
          <SectionHeader title="Location" icon="place" step={1} />
          <View className="bg-[#111] p-4 rounded-2xl border border-white/5 mb-8 flex-row gap-4 items-center">
            <View className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 shadow-sm border border-white/5">
                <Image source={{ uri: arena?.image }} className="w-full h-full" resizeMode="cover" />
            </View>
            <View className="flex-1">
                <Text className="text-white font-black uppercase tracking-tight">{arena?.name || 'Pick Arena'}</Text>
                <Text className="text-white/40 text-[10px] font-bold mt-0.5">{arena?.location || 'Unknown'}</Text>
            </View>
          </View>

          <SectionHeader title="Schedule" icon="event" step={2} />
          <View className="bg-[#111] p-4 rounded-2xl border border-white/5 mb-12 flex-row gap-6">
              <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-amber-400/5 rounded-xl items-center justify-center border border-amber-400/10">
                    <MaterialIcons name="calendar-today" size={16} color="#fbbf24" />
                  </View>
                  <View>
                      <Text className="text-white/20 text-[8px] font-black uppercase tracking-widest">Date</Text>
                      <Text className="text-white font-black text-xs">{displayDate}</Text>
                  </View>
              </View>
              <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-amber-400/5 rounded-xl items-center justify-center border border-amber-400/10">
                    <MaterialIcons name="access-time" size={16} color="#fbbf24" />
                  </View>
                  <View>
                      <Text className="text-white/20 text-[8px] font-black uppercase tracking-widest">Kick Off</Text>
                      <Text className="text-white font-black text-xs">{details.time || 'TBD'}</Text>
                  </View>
              </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Original Solo Review Layout
  return (
    <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
      <View className="mb-8">
        <Text className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">Review & Post</Text>
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
              <Text className="text-white/40 text-[9px] font-bold uppercase mb-1">Required Skill</Text>
              <Text className="text-white font-black">{settings.skillLevel || 'Any'}</Text>
            </View>
            <View className="flex-1 p-4">
              <Text className="text-white/40 text-[9px] font-bold uppercase mb-1">Price</Text>
              <Text className="text-amber-400 font-black uppercase">
                {settings.price > 0 ? `NPR ${settings.price}` : 'FREE'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
