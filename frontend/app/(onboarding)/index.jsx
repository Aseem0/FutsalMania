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
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

let LinearGradient;
try {
  LinearGradient = require("expo-linear-gradient").LinearGradient;
} catch (e) {
  LinearGradient = ({ children, style }) => (
    <View style={style}>{children}</View>
  );
}

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return (
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 160 }}
          >
            <Text className="text-white text-[32px] font-bold leading-tight pt-8">
              Tell us about yourself
            </Text>

            <Text className="text-white/60 text-base leading-normal pt-2 mb-10">
              This helps us find the best matches for your style of play.
            </Text>

            {/* Preferred Position */}
            <Text className="text-white text-xs font-bold tracking-widest uppercase mb-4 opacity-80">
              Preferred Position
            </Text>

            <View className="mb-10">
              <View className="flex-row flex-wrap gap-3">
                <TouchableOpacity className="flex-col items-center justify-center p-6 rounded-xl flex-1 min-w-[45%] bg-white/5 border border-white/10">
                  <Ionicons
                    name="hand-left"
                    size={30}
                    color="#ffffff"
                    style={{ marginBottom: 8 }}
                  />
                  <Text className="text-sm text-white font-medium">
                    Goalkeeper
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-col items-center justify-center rounded-xl flex-1 min-w-[45%] bg-white/10 border-2 border-white">
                  <Ionicons
                    name="shield"
                    size={30}
                    color="#ffffff"
                    style={{ marginBottom: 8 }}
                  />
                  <Text className="text-sm text-white font-semibold">
                    Defender
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-col items-center justify-center p-6 rounded-xl flex-1 min-w-[45%] bg-white/5 border border-white/10">
                  <Ionicons
                    name="git-compare"
                    size={30}
                    color="#ffffff"
                    style={{ marginBottom: 8 }}
                  />
                  <Text className="text-sm text-white font-medium">
                    Midfielder
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-col items-center justify-center p-6 rounded-xl flex-1 min-w-[45%] bg-white/5 border border-white/10">
                  <Ionicons
                    name="flash"
                    size={30}
                    color="#ffffff"
                    style={{ marginBottom: 8 }}
                  />
                  <Text className="text-sm text-white font-medium">
                    Forward
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Skill Level */}
            <Text className="text-white text-xs font-bold tracking-widest uppercase mb-4 opacity-80">
              Skill Level
            </Text>

            <View className="bg-[#1c1c1e] p-0.5 rounded-xl mb-10">
              <View className="flex-row">
                <TouchableOpacity className="flex-1 items-center py-2.5 rounded-[10px] bg-transparent">
                  <Text className="text-sm font-medium text-white/60">Beg</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 items-center py-2.5 rounded-[10px] bg-[#3a3a3c]">
                  <Text className="text-sm font-medium text-white">Int</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 items-center py-2.5 rounded-[10px] bg-transparent">
                  <Text className="text-sm font-medium text-white/60">Adv</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 items-center py-2.5 rounded-[10px] bg-transparent">
                  <Text className="text-sm font-medium text-white/60">Pro</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        );
      case 1:
        return (
          <SafeAreaView className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <View className="flex-1 max-w-md mx-auto w-full bg-black border-x border-zinc-900">
              {/* Scrollable Content */}
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 160 }}
              >
                <Text className="text-white text-[32px] font-bold leading-tight px-6 pb-3 pt-6">
                  Set your preferences
                </Text>

                {/* Preferred Playing Times */}
                <View className="mt-4 px-6">
                  <Text className="text-white text-xs font-bold tracking-wider uppercase mb-4">
                    Preferred Playing Times
                  </Text>

                  <View className="flex-row flex-wrap gap-2">
                    {/* Morning */}
                    <TouchableOpacity className="h-11 items-center justify-center rounded-xl border border-white/20 bg-zinc-900 px-5">
                      <Text className="text-white text-sm font-semibold">
                        Morning
                      </Text>
                    </TouchableOpacity>

                    {/* Afternoon - Selected */}
                    <TouchableOpacity className="h-11 items-center justify-center rounded-xl bg-white px-5">
                      <Text className="text-black text-sm font-semibold">
                        Afternoon
                      </Text>
                    </TouchableOpacity>

                    {/* Evening */}
                    <TouchableOpacity className="h-11 items-center justify-center rounded-xl border border-white/20 bg-zinc-900 px-5">
                      <Text className="text-white text-sm font-semibold">
                        Evening
                      </Text>
                    </TouchableOpacity>

                    {/* Night */}
                    <TouchableOpacity className="h-11 items-center justify-center rounded-xl border border-white/20 bg-zinc-900 px-5">
                      <Text className="text-white text-sm font-semibold">
                        Night
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Preferred Days */}
                <View className="mt-10 px-6">
                  <Text className="text-white text-xs font-bold tracking-wider uppercase mb-4">
                    Preferred Days
                  </Text>

                  <View className="flex-row flex-wrap gap-2">
                    {/* Monday */}
                    <TouchableOpacity className="h-11 min-w-[54px] items-center justify-center rounded-xl border border-white/20 bg-zinc-900">
                      <Text className="text-white text-sm font-semibold">
                        Mon
                      </Text>
                    </TouchableOpacity>

                    {/* Tuesday */}
                    <TouchableOpacity className="h-11 min-w-[54px] items-center justify-center rounded-xl border border-white/20 bg-zinc-900">
                      <Text className="text-white text-sm font-semibold">
                        Tue
                      </Text>
                    </TouchableOpacity>

                    {/* Wednesday - Selected */}
                    <TouchableOpacity className="h-11 min-w-[54px] items-center justify-center rounded-xl bg-white">
                      <Text className="text-black text-sm font-semibold">
                        Wed
                      </Text>
                    </TouchableOpacity>

                    {/* Thursday */}
                    <TouchableOpacity className="h-11 min-w-[54px] items-center justify-center rounded-xl border border-white/20 bg-zinc-900">
                      <Text className="text-white text-sm font-semibold">
                        Thu
                      </Text>
                    </TouchableOpacity>

                    {/* Friday */}
                    <TouchableOpacity className="h-11 min-w-[54px] items-center justify-center rounded-xl border border-white/20 bg-zinc-900">
                      <Text className="text-white text-sm font-semibold">
                        Fri
                      </Text>
                    </TouchableOpacity>

                    {/* Saturday - Selected */}
                    <TouchableOpacity className="h-11 min-w-[54px] items-center justify-center rounded-xl bg-white">
                      <Text className="text-black text-sm font-semibold">
                        Sat
                      </Text>
                    </TouchableOpacity>

                    {/* Sunday - Selected */}
                    <TouchableOpacity className="h-11 min-w-[54px] items-center justify-center rounded-xl bg-white">
                      <Text className="text-black text-sm font-semibold">
                        Sun
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Location / Area */}
                <View className="mt-10 px-6">
                  <Text className="text-white text-xs font-bold tracking-wider uppercase mb-4">
                    Location / Area
                  </Text>

                  <View className="relative">
                    <TouchableOpacity
                      className="w-full flex-row items-center justify-between h-14 pl-12 pr-4 bg-transparent border border-white rounded-xl"
                      activeOpacity={0.7}
                    >
                      <View className="absolute left-4 top-0 h-full justify-center">
                        <Ionicons
                          name="location-outline"
                          size={20}
                          color="#ffffff"
                        />
                      </View>

                      <Text className="text-white text-sm font-medium">
                        Select your preferred area...
                      </Text>

                      <Ionicons name="chevron-down" size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        );
      case 2:
        return (
          <View className="flex-1 bg-black justify-center items-center px-6">
            <Text className="text-white text-2xl font-bold mb-4">
              Slide 3 Placeholder
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              className="bg-white px-8 py-3 rounded-full"
            >
              <Text className="text-black font-bold">Go to Home</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="flex-1 max-w-md mx-auto w-full bg-black">
        {/* Persistent Header */}
        <View className="px-6 pt-8">
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
              onPress={() => {
                if (currentSlide > 0) {
                  setCurrentSlide(currentSlide - 1);
                } else {
                  router.back();
                }
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>

            <Text className="text-sm font-medium text-white/60">
              Step {currentSlide + 1} of 3
            </Text>

            <View className="w-10" />
          </View>

          {/* Persistent Progress Bar */}
          <View className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <View
              className="bg-white h-full rounded-full"
              style={{ width: `${((currentSlide + 1) / 3) * 100}%` }}
            />
          </View>
        </View>

        {/* Dynamic Content */}
        {renderSlide()}

        {/* Persistent Bottom Button */}
        <View className="absolute bottom-0 left-0 right-0">
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.95)", "#000000"]}
            className="pt-12 px-6 pb-6"
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (currentSlide < 2) {
                  setCurrentSlide(currentSlide + 1);
                } else {
                  router.replace("/(tabs)");
                }
              }}
              className="w-full bg-white py-4 rounded-xl flex-row items-center justify-center active:scale-[0.98]"
            >
              <Text className="text-black font-bold text-base tracking-wide">
                {currentSlide === 2 ? "FINISH" : "NEXT"}
              </Text>
              <Ionicons
                name={currentSlide === 2 ? "checkmark" : "chevron-forward"}
                size={20}
                color="#000000"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
            <View className="h-6" />
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
  );
}
