import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchArenaSlots } from '../../services/api';

// Converts "06:00" → "6:00 AM" for display
const formatTimeDisplay = (value) => {
  if (!value || value.includes('AM') || value.includes('PM')) return value; // already formatted
  const [h, m] = value.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${String(m).padStart(2, '0')} ${period}`;
};

export default function DetailsStep({ arenaId, details, onUpdate }) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (arenaId && details.date) {
      loadAvailability();
    }
  }, [arenaId, details.date]);

  const loadAvailability = async () => {
    try {
      setLoadingSlots(true);
      const res = await fetchArenaSlots(arenaId, details.date);
      setBookedSlots(res.data.bookedSlots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const localFull = `${y}-${m}-${d}`;
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      full: localFull,
      isToday: i === 0,
    };
  });

  const amSlots = [
    { label: "6:00 AM",  value: "06:00" },
    { label: "7:00 AM",  value: "07:00" },
    { label: "8:00 AM",  value: "08:00" },
    { label: "9:00 AM",  value: "09:00" },
    { label: "10:00 AM", value: "10:00" },
    { label: "11:00 AM", value: "11:00" },
  ];

  const pmSlots = [
    { label: "12:00 PM", value: "12:00" },
    { label: "1:00 PM",  value: "13:00" },
    { label: "2:00 PM",  value: "14:00" },
    { label: "3:00 PM",  value: "15:00" },
    { label: "4:00 PM",  value: "16:00" },
    { label: "5:00 PM",  value: "17:00" },
    { label: "6:00 PM",  value: "18:00" },
    { label: "7:00 PM",  value: "19:00" },
    { label: "8:00 PM",  value: "20:00" },
  ];

  const isSlotBooked = (value) => bookedSlots.some((s) => s.startsWith(value));
  
  const isSlotPassed = (value) => {
    if (details.date !== dates[0].full) return false;
    const currentTime = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kathmandu", hour12: false }).substring(0, 5);
    return value < currentTime;
  };

  // Compare using 24hr value — details.time is now stored as "06:00" not "6:00 AM"
  const isSlotSelected = (value) => details.time === value;

  const renderSlot = (slot) => {
    const booked = isSlotBooked(slot.value);
    const passed = isSlotPassed(slot.value);
    const selected = isSlotSelected(slot.value);
    const disabled = booked || passed;

    return (
      <TouchableOpacity
        key={slot.value}
        disabled={disabled}
        onPress={() => onUpdate({ time: slot.value })}
        activeOpacity={0.7}
        style={{ width: '30%' }}
        className={`py-3 rounded-2xl items-center justify-center border mb-2.5 ${selected ? 'bg-amber-400 border-amber-400' : disabled ? 'bg-[#0e0e0e] border-white/[0.04]' : 'bg-[#111] border-white/[0.07]'}`}
      >
        {disabled && !selected ? (
          <>
            <Text className="text-[11px] font-bold text-white/20 line-through">{slot.label}</Text>
            <View className="flex-row items-center gap-0.5 mt-0.5">
              <MaterialIcons name={passed ? "history" : "do-not-disturb-on"} size={9} color="#3f3f46" />
              <Text className="text-[9px] font-bold text-zinc-700 uppercase tracking-wider">{passed ? "Passed" : "Booked"}</Text>
            </View>
          </>
        ) : (
          <Text className={`text-[12px] font-bold ${selected ? 'text-black' : 'text-white/60'}`}>
            {slot.label}
          </Text>
        )}
        {selected && (
          <View className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-black border-2 border-amber-400 items-center justify-center">
            <MaterialIcons name="check" size={9} color="#fbbf24" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const selectedDateObj = details.date
    ? new Date(details.date + 'T00:00:00')
    : null;

  const formattedDate = selectedDateObj
    ? selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : null;

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 100 }}
    >
      {/* Header */}
      <View className="mb-7">
        <Text className="text-[11px] font-black text-amber-400 uppercase tracking-[3px] mb-1">Step 2</Text>
        <Text className="text-2xl font-black text-white">When to Play?</Text>
        <Text className="text-white/40 text-sm font-medium mt-1">
          Pick a date and a 1-hour slot for your match.
        </Text>
      </View>

      {/* ─── DATE SECTION ───────────────────────────── */}
      <View className="mb-7">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="event" size={14} color="#fbbf24" />
            <Text className="text-[11px] font-black text-white/50 uppercase tracking-[2px]">Select Date</Text>
          </View>
          {formattedDate && (
            <Text className="text-[11px] font-bold text-amber-400">{formattedDate}</Text>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24 }}>
          <View className="flex-row gap-2.5" style={{ paddingHorizontal: 24, paddingRight: 48 }}>
            {dates.map((d) => {
              const isSelected = details.date === d.full;
              return (
                <TouchableOpacity
                  key={d.full}
                  onPress={() => onUpdate({ date: d.full, time: '' })}
                  activeOpacity={0.8}
                  className={`rounded-2xl items-center justify-center border ${isSelected ? 'bg-amber-400 border-amber-400' : 'bg-[#111] border-white/[0.07]'}`}
                  style={{ width: 62, height: 78 }}
                >
                  {d.isToday && !isSelected && (
                    <View className="absolute top-2 w-1 h-1 rounded-full bg-amber-400" />
                  )}
                  <Text className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${isSelected ? 'text-black/60' : 'text-white/30'}`}>
                    {d.day}
                  </Text>
                  <Text className={`text-[22px] font-black leading-tight ${isSelected ? 'text-black' : d.isToday ? 'text-amber-400' : 'text-white'}`}>
                    {d.date}
                  </Text>
                  <Text className={`text-[9px] font-bold uppercase mb-2 ${isSelected ? 'text-black/50' : 'text-white/20'}`}>
                    {d.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* ─── TIME SECTION ───────────────────────────── */}
      <View>
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="schedule" size={14} color="#fbbf24" />
            <Text className="text-[11px] font-black text-white/50 uppercase tracking-[2px]">Select Time</Text>
          </View>
          {/* Legend */}
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-amber-400" />
              <Text className="text-[9px] font-bold text-white/30">Selected</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-zinc-700" />
              <Text className="text-[9px] font-bold text-white/30">Booked</Text>
            </View>
          </View>
        </View>

        {!details.date ? (
          /* No date selected prompt */
          <View className="py-10 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0d0d0d]">
            <MaterialIcons name="touch-app" size={28} color="#3f3f46" />
            <Text className="text-white/30 font-bold text-sm mt-2">Select a date first</Text>
            <Text className="text-white/15 font-medium text-xs mt-1">Slots will appear here</Text>
          </View>
        ) : loadingSlots ? (
          /* Loading */
          <View className="py-12 items-center justify-center rounded-3xl border border-white/[0.06] bg-[#0d0d0d]">
            <ActivityIndicator color="#fbbf24" size="small" />
            <Text className="text-white/30 text-xs font-bold uppercase tracking-widest mt-3">
              Checking Availability...
            </Text>
          </View>
        ) : (
          /* Slot grid */
          <View>
            {/* AM */}
            <View className="mb-5">
              <View className="flex-row items-center gap-2 mb-3">
                <View className="h-px flex-1 bg-white/[0.06]" />
                <Text className="text-[10px] font-black text-white/25 uppercase tracking-widest">Morning</Text>
                <View className="h-px flex-1 bg-white/[0.06]" />
              </View>
              <View className="flex-row flex-wrap gap-2.5">
                {amSlots.map(renderSlot)}
              </View>
            </View>

            {/* PM */}
            <View>
              <View className="flex-row items-center gap-2 mb-3">
                <View className="h-px flex-1 bg-white/[0.06]" />
                <Text className="text-[10px] font-black text-white/25 uppercase tracking-widest">Afternoon / Evening</Text>
                <View className="h-px flex-1 bg-white/[0.06]" />
              </View>
              <View className="flex-row flex-wrap gap-2.5">
                {pmSlots.map(renderSlot)}
              </View>
            </View>

            {/* Availability summary bar */}
            {bookedSlots.length > 0 && (
              <View className="mt-4 flex-row items-center gap-2 bg-zinc-900/80 border border-white/[0.06] rounded-2xl px-4 py-3">
                <MaterialIcons name="info-outline" size={14} color="#71717a" />
                <Text className="text-zinc-500 text-xs font-medium flex-1">
                  <Text className="text-white/60 font-bold">{bookedSlots.length}</Text> slot{bookedSlots.length !== 1 ? 's' : ''} already booked on this day.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
