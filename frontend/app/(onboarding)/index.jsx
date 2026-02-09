import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

let LinearGradient;
try {
  const ExpoLinearGradient = require("expo-linear-gradient");
  LinearGradient = ExpoLinearGradient.LinearGradient || ExpoLinearGradient;
} catch (e) {
  LinearGradient = ({ children, style, ...props }) => (
    <View style={style} {...props}>{children || null}</View>
  );
}

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const [selections, setSelections] = useState({
    position: null,
    skillLevel: null,
    times: [],
    days: [],
  });

  const toggleSelection = (category, value) => {
    setSelections((prev) => {
      const current = prev[category];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [category]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [category]: value };
    });
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return (
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View className="pt-10">
              <Text className="text-white text-[30px] font-black leading-tight">
                Tell us about yourself
              </Text>
            </View>

            <Text className="text-white/50 text-[15px] font-medium leading-relaxed pt-6 mb-10">
              Personalize your profile to find matches that fit your playing style
              and availability.
            </Text>

            {/* Preferred Position */}
            <View className="flex-row items-center justify-between mb-5 px-1">
              <Text className="text-white/40 text-[11px] font-black tracking-[2px] uppercase">
                Preferred Position
              </Text>
              <View className="h-[1px] flex-1 bg-white/5 ml-4" />
            </View>

            <View className="flex-row flex-wrap justify-between">
              {[
                { id: "Goalkeeper", icon: "hand-left", label: "GK" },
                { id: "Defender", icon: "shield", label: "DF" },
                { id: "Midfielder", icon: "git-compare", label: "MF" },
                { id: "Forward", icon: "flash", label: "FW" },
              ].map((item) => (
                <View key={item.id} className="w-[48%] mb-4">
                  <TouchableOpacity
                    onPress={() => toggleSelection("position", item.id)}
                    activeOpacity={0.8}
                    className={`flex-col items-center justify-center p-6 rounded-[32px] h-40 border-2 ${
                      selections.position === item.id
                        ? "bg-amber-400"
                        : "bg-zinc-900/40 border-white/5"
                    }`}
                  >
                    <View
                      className={`w-14 h-14 rounded-full items-center justify-center mb-4 ${
                        selections.position === item.id
                          ? "bg-black/5"
                          : "bg-white/5"
                      }`}
                    >
                      <Ionicons
                        name={item.icon}
                        size={28}
                        color={selections.position === item.id ? "#000" : "#fff"}
                      />
                    </View>
                    <Text
                      className={`text-[14px] font-black tracking-tight ${
                        selections.position === item.id
                          ? "text-black"
                          : "text-white/90"
                      }`}
                    >
                      {item.id}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Skill Level Section */}
            <View className="mt-8">
              <View className="flex-row items-center justify-between mb-5 px-1">
                <Text className="text-white/40 text-[11px] font-black tracking-[2px] uppercase">
                  Skill Level
                </Text>
                <View className="h-[1px] flex-1 bg-white/5 ml-4" />
              </View>

              <View className="bg-zinc-900/50 p-2 rounded-[24px] flex-row border border-white/5">
                {["Beg", "Int", "Adv", "Pro"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => toggleSelection("skillLevel", level)}
                    className={`flex-1 items-center py-4 rounded-[18px] ${
                      selections.skillLevel === level ? "bg-amber-400" : ""
                    }`}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: selections.skillLevel === level ? 0.2 : 0,
                      shadowRadius: 8,
                      elevation: selections.skillLevel === level ? 3 : 0,
                    }}
                  >
                    <Text
                      className={`text-[13px] font-black ${
                        selections.skillLevel === level
                          ? "text-black"
                          : "text-white/30"
                      }`}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text 
                className="text-center text-white/30 text-[11px] font-bold mt-4 uppercase"
                style={{ letterSpacing: 1 }}
              >
                {(() => {
                  const level = selections?.skillLevel;
                  if (level === "Beg") return "New to the game";
                  if (level === "Int") return "Play regularly";
                  if (level === "Adv") return "Competitive player";
                  if (level === "Pro") return "Elite / Professional";
                  return "Select your experience level";
                })()}
              </Text>
            </View>
          </ScrollView>
        );
      case 1:
        return (
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 180 }}
          >
            <View className="pt-10">
              <Text className="text-white text-[30px] font-black leading-tight">
                Set your preferences
              </Text>
            </View>

            {/* Preferred Playing Times */}
            <View className="mt-10">
              <View className="flex-row items-center justify-between mb-5 px-1">
                <Text className="text-white/40 text-[11px] font-black tracking-[2px] uppercase">
                  Preferred Playing Times
                </Text>
                <View className="h-[1px] flex-1 bg-white/5 ml-4" />
              </View>

              <View className="flex-row flex-wrap gap-3">
                {["Morning", "Afternoon", "Evening", "Night"].map((time) => (
                  <TouchableOpacity
                    key={time}
                    onPress={() => toggleSelection("times", time)}
                    className={`h-14 items-center justify-center rounded-2xl px-6 border-2 ${
                      selections.times.includes(time)
                        ? "bg-amber-400"
                        : "bg-zinc-900/40 border-white/5"
                    }`}
                  >
                    <Text
                      className={`text-[14px] font-black ${
                        selections.times.includes(time) ? "text-black" : "text-white/90"
                      }`}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preferred Days */}
            <View className="mt-12">
              <View className="flex-row items-center justify-between mb-5 px-1">
                <Text className="text-white/40 text-[11px] font-black tracking-[2px] uppercase">
                  Preferred Days
                </Text>
                <View className="h-[1px] flex-1 bg-white/5 ml-4" />
              </View>

              <View className="flex-row flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => toggleSelection("days", day)}
                    className={`h-12 min-w-[58px] items-center justify-center rounded-2xl border-2 ${
                      selections.days.includes(day)
                        ? "bg-amber-400"
                        : "bg-zinc-900/40 border-white/5"
                    }`}
                  >
                    <Text
                      className={`text-[13px] font-black ${
                        selections.days.includes(day) ? "text-black" : "text-white/90"
                      }`}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location / Area */}
            <View className="mt-12">
              <View className="flex-row items-center justify-between mb-5 px-1">
                <Text className="text-white/40 text-[11px] font-black tracking-[2px] uppercase">
                  Location / Area
                </Text>
                <View className="h-[1px] flex-1 bg-white/5 ml-4" />
              </View>

              <TouchableOpacity
                className="w-full flex-row items-center justify-between h-16 pl-14 pr-6 bg-zinc-900/40 border-2 border-white/5 rounded-2xl"
                activeOpacity={0.8}
              >
                <View className="absolute left-5 top-0 h-full justify-center">
                  <Ionicons name="location" size={24} color="#ffffff" />
                </View>

                <Text className="text-white/50 text-[15px] font-bold">
                  Select your preferred area...
                </Text>

                <Ionicons name="chevron-down" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case 2:
        return (
          <View className="flex-1 px-8 items-center justify-center">
            <ScrollView
            className="flex-1 px-8"
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingBottom: 200 }}
            showsVerticalScrollIndicator={false}
          >
              <View
                className="bg-white w-24 h-24 rounded-3xl items-center justify-center mb-8 shadow-2xl"
                style={{ transform: [{ rotate: "12deg" }] }}
              >
                <Ionicons name="checkmark-circle" size={60} color="black" />
              </View>
              <Text className="text-white text-[32px] font-black mb-4 text-center leading-tight">
                You're all set!
              </Text>
              <Text className="text-white/50 text-center text-lg px-4 leading-relaxed font-bold">
                Your profile is ready. Now you can find and host matches near you.
              </Text>
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="flex-1 max-w-md mx-auto w-full bg-black">
        {/* Persistent Header */}
        <View className="px-6 pt-2">
          <View className="flex-row items-center justify-between mb-3">
            <TouchableOpacity
              className={`w-11 h-11 items-center justify-center rounded-full bg-zinc-900 border border-white/10 active:bg-zinc-800 ${
                currentSlide === 0 ? "opacity-0" : "opacity-100"
              }`}
              disabled={currentSlide === 0}
              onPress={() => {
                if (currentSlide > 0) {
                  setCurrentSlide(currentSlide - 1);
                }
              }}
            >
              <Ionicons name="arrow-back" size={22} color="#ffffff" />
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-sm font-bold text-white/50 tracking-widest">
                Step {currentSlide + 1} of 3
              </Text>
            </View>

            <View className="w-11" />
          </View>

          {/* Persistent Progress Bar */}
          <View className="w-full bg-white/10 h-[4px] rounded-full overflow-hidden">
            <View
              className="bg-amber-400 h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
              style={{
                width: `${((currentSlide + 1) / 3) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Dynamic Content */}
        {renderSlide()}

        {/* Persistent Bottom Button - Fixed at bottom with safe area consideration */}
        <View className="absolute bottom-4 left-0 right-0 px-6">
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)", "#000000"]}
            className="absolute bottom-[-20px] left-0 right-0 h-44"
            pointerEvents="none"
          />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (currentSlide < 2) {
                setCurrentSlide(currentSlide + 1);
              } else {
                router.replace("/(tabs)");
              }
            }}
            className="w-full h-16 bg-amber-400 rounded-[24px] flex-row items-center justify-center"
            style={{
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 5,
            }}
          >
            <Text className="text-black font-black text-[15px] tracking-[2px]">
              {currentSlide === 2 ? "GET STARTED" : "CONTINUE"}
            </Text>
            <View className="ml-3 bg-black/5 p-2 rounded-full">
              <Ionicons
                name={currentSlide === 2 ? "rocket" : "arrow-forward"}
                size={18}
                color="#000000"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>


  );
}
