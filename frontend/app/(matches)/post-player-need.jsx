import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createRecruitment } from "../../services/api";

export default function PostPlayerNeed() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: "Attacker",
    level: "Intermediate",
    date: "",
    time: "",
    playersNeeded: "1",
    description: "",
  });

  const roles = ["Attacker", "Midfielder", "Defender", "Goalkeeper"];
  const levels = ["Casual", "Intermediate", "Competitive", "Pro"];

  // Generate next 7 days (reusing logic from DetailsStep)
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      full: date.toISOString().split("T")[0],
    };
  });

  const timeSlots = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/explore");
    }
  };

  const handlePost = async () => {
    try {
      // Basic validation
      if (!formData.date || !formData.time) {
        alert("Please select date and time");
        return;
      }

      const recruitmentData = {
        role: formData.role,
        level: formData.level,
        date: formData.date,
        time: formData.time,
        playersNeeded: parseInt(formData.playersNeeded),
        description: formData.description,
      };

      await createRecruitment(recruitmentData);
      router.back();
    } catch (error) {
      console.error("Error posting recruitment:", error);
      alert("Failed to post recruitment. Please try again.");
    }
  };

  const SelectChip = ({ label, selected, onSelect }) => (
    <TouchableOpacity
      onPress={() => onSelect(label)}
      className={`px-5 py-3 rounded-2xl border ${
        selected ? "bg-amber-400 border-amber-400" : "bg-[#111] border-white/5"
      }`}
    >
      <Text
        className={`text-xs font-black uppercase tracking-wider ${
          selected ? "text-black" : "text-white/60"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <View className="flex-1 max-w-md mx-auto w-full border-x border-white/5">
        {/* Header */}
        <View className="px-6 pt-6 pb-2">
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity
              onPress={handleBack}
              className="w-12 h-12 items-center justify-center rounded-2xl bg-[#111] border border-white/5"
            >
              <MaterialIcons name="chevron-left" size={28} color="#ffffff" />
            </TouchableOpacity>

            <Text className="text-xl font-black uppercase tracking-tighter text-white">
              Post Player Need
            </Text>

            <View className="w-12" />
          </View>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="pb-32">
            {/* Role Selection */}
            <View className="mb-8">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-4">
                What role do you need?
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {roles.map((role) => (
                  <SelectChip
                    key={role}
                    label={role}
                    selected={formData.role === role}
                    onSelect={(val) => setFormData({ ...formData, role: val })}
                  />
                ))}
              </View>
            </View>

            {/* Skill Level Selection */}
            <View className="mb-8">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-4">
                Skill Level Required
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {levels.map((level) => (
                  <SelectChip
                    key={level}
                    label={level}
                    selected={formData.level === level}
                    onSelect={(val) => setFormData({ ...formData, level: val })}
                  />
                ))}
              </View>
            </View>

            {/* Date Selection */}
            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px]">
                  Select Date
                </Text>
                {formData.date && (
                  <Text className="text-amber-400 text-[10px] font-black uppercase">
                    {new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                )}
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                <View className="flex-row gap-3 pr-12">
                  {dates.map((d) => (
                    <TouchableOpacity
                      key={d.full}
                      onPress={() => setFormData({ ...formData, date: d.full })}
                      className={`w-16 h-20 rounded-2xl items-center justify-center border ${
                        formData.date === d.full
                          ? "bg-amber-400 border-amber-400"
                          : "bg-[#111] border-white/5"
                      }`}
                    >
                      <Text className={`text-[10px] font-black uppercase ${
                        formData.date === d.full ? "text-black" : "text-white/40"
                      }`}>
                        {d.day}
                      </Text>
                      <Text className={`text-xl font-black my-0.5 ${
                        formData.date === d.full ? "text-black" : "text-white"
                      }`}>
                        {d.date}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Time Selection */}
            <View className="mb-8">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-4">
                Select Time
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setFormData({ ...formData, time })}
                    className={`px-4 py-3 rounded-xl border ${
                      formData.time === time
                        ? "bg-amber-400 border-amber-400"
                        : "bg-[#111] border-white/5"
                    }`}
                  >
                    <Text className={`text-xs font-bold ${
                      formData.time === time ? "text-black" : "text-white/60"
                    }`}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Players Needed & Description */}
            <View className="mb-8">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-4">
                Additional Info
              </Text>
              
              <View className="bg-[#111] border border-white/5 rounded-2xl p-4 mb-4">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-white/60 text-sm font-bold">Players Needed</Text>
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity 
                      onPress={() => setFormData({ ...formData, playersNeeded: Math.max(1, parseInt(formData.playersNeeded) - 1).toString() })}
                      className="w-8 h-8 rounded-full bg-white/5 items-center justify-center"
                    >
                      <MaterialIcons name="remove" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-black text-lg">{formData.playersNeeded}</Text>
                    <TouchableOpacity 
                      onPress={() => setFormData({ ...formData, playersNeeded: (parseInt(formData.playersNeeded) + 1).toString() })}
                      className="w-8 h-8 rounded-full bg-amber-400 items-center justify-center"
                    >
                      <MaterialIcons name="add" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TextInput
                  placeholder="Need a calm defender but fast..."
                  placeholderTextColor="#3f3f46"
                  multiline
                  numberOfLines={4}
                  value={formData.description}
                  onChangeText={(val) => setFormData({ ...formData, description: val })}
                  className="text-white font-medium text-sm border-t border-white/5 pt-4 h-24"
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Post Button */}
        <View className="absolute bottom-0 left-0 right-0 px-6 py-6 bg-black/80 border-t border-white/5">
          <TouchableOpacity
            onPress={handlePost}
            className="w-full bg-amber-400 py-4 rounded-2xl items-center justify-center shadow-lg shadow-amber-400/20"
            activeOpacity={0.9}
          >
            <Text className="text-black font-black uppercase tracking-widest">
              Post Recruitment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
