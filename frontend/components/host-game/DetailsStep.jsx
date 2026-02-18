import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function DetailsStep({ details, onUpdate }) {
  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      full: date.toISOString().split('T')[0],
      isToday: i === 0
    };
  });

  const timeSlots = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  return (
    <ScrollView className="flex-1 px-6 pt-4 pb-20" showsVerticalScrollIndicator={false}>
      <View className="mb-8">
        <Text className="text-2xl font-black text-white mb-2">Game Details</Text>
        <Text className="text-white/50 text-sm font-medium">
          Choose a date and time for your match.
        </Text>
      </View>

      {/* Date Selector */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4 ml-1">
          <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px]">
            Select Date
          </Text>
          <Text className="text-amber-400 text-[10px] font-black uppercase tracking-[1px]">
            {details.date ? new Date(details.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'Choose a day'}
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
          <View className="flex-row gap-3 pr-12">
            {dates.map((d) => (
              <TouchableOpacity
                key={d.full}
                onPress={() => onUpdate({ date: d.full })}
                className={`w-16 h-20 rounded-2xl items-center justify-center border ${
                  details.date === d.full 
                    ? "bg-amber-400 border-amber-400" 
                    : "bg-[#111] border-white/5"
                }`}
              >
                <Text className={`text-[10px] font-black uppercase tracking-wider ${
                  details.date === d.full ? "text-black" : "text-white/40"
                }`}>
                  {d.day}
                </Text>
                <Text className={`text-xl font-black my-0.5 ${
                  details.date === d.full ? "text-black" : "text-white"
                }`}>
                  {d.date}
                </Text>
                <Text className={`text-[9px] font-bold uppercase ${
                  details.date === d.full ? "text-black/60" : "text-white/20"
                }`}>
                  {d.month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Time Selector */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4 ml-1">
          <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px]">
            Select Time
          </Text>
          {details.time && (
            <View className="flex-row items-center">
              <MaterialIcons name="access-time" size={12} color="#fbbf24" />
              <Text className="text-amber-400 text-[10px] font-black uppercase tracking-[1px] ml-1">
                {details.time}
              </Text>
            </View>
          )}
        </View>
        
        <View className="flex-row flex-wrap gap-2">
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              onPress={() => onUpdate({ time })}
              className={`px-4 py-3 rounded-xl border ${
                details.time === time 
                  ? "bg-amber-400 border-amber-400" 
                  : "bg-[#111] border-white/5"
              }`}
            >
              <Text className={`text-xs font-bold ${
                details.time === time ? "text-black" : "text-white/60"
              }`}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
