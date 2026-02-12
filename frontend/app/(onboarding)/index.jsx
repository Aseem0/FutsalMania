import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import OnboardingHeader from "../../components/OnboardingHeader";
import SelectionCard from "../../components/SelectionCard";

// Slide 1: Personal Info & Position
const StepOne = ({ selections, toggleSelection }) => (
  <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
    <View className="pt-10">
      <Text className="text-white text-[30px] font-black leading-tight">Tell us about yourself</Text>
      <Text className="text-white/50 text-[15px] font-medium leading-relaxed pt-6 mb-10">
        Personalize your profile to find matches that fit your playing style and availability.
      </Text>
    </View>

    <SectionHeader title="Preferred Position" />
    <View className="flex-row flex-wrap justify-between">
      {[
        { id: "Goalkeeper", icon: "hand-left" },
        { id: "Defender", icon: "shield" },
        { id: "Midfielder", icon: "git-compare" },
        { id: "Forward", icon: "flash" },
      ].map((item) => (
        <View key={item.id} className="w-[48%] mb-4">
          <SelectionCard
            label={item.id}
            icon={item.icon}
            isSelected={selections.position === item.id}
            onPress={() => toggleSelection("position", item.id)}
          />
        </View>
      ))}
    </View>

    <SectionHeader title="Skill Level" />
    <View className="bg-zinc-900/50 p-2 rounded-[24px] flex-row border border-white/5">
      {["Beg", "Int", "Adv", "Pro"].map((level) => (
        <TouchableOpacity
          key={level}
          onPress={() => toggleSelection("skillLevel", level)}
          className={`flex-1 items-center py-4 rounded-[18px] ${selections.skillLevel === level ? "bg-amber-400" : ""}`}
        >
          <Text className={`text-[13px] font-black ${selections.skillLevel === level ? "text-black" : "text-white/30"}`}>
            {level}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
);

// Slide 2: Preferences & Schedule
const StepTwo = ({ selections, toggleSelection }) => (
  <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
    <View className="pt-10">
      <Text className="text-white text-[30px] font-black leading-tight">Set your preferences</Text>
    </View>

    <SectionHeader title="Preferred Playing Times" />
    <View className="flex-row flex-wrap gap-3">
      {["Morning", "Afternoon", "Evening", "Night"].map((time) => (
        <SelectionCard
          key={time}
          type="pill"
          label={time}
          isSelected={selections.times.includes(time)}
          onPress={() => toggleSelection("times", time)}
        />
      ))}
    </View>

    <SectionHeader title="Preferred Days" />
    <View className="flex-row flex-wrap gap-2">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        <SelectionCard
          key={day}
          type="pill"
          label={day}
          isSelected={selections.days.includes(day)}
          onPress={() => toggleSelection("days", day)}
        />
      ))}
    </View>
  </ScrollView>
);

// Slide 3: Final Confirmation
const StepThree = () => (
  <View className="flex-1 px-8 items-center justify-center">
    <View className="bg-white w-24 h-24 rounded-3xl items-center justify-center mb-8 shadow-2xl rotate-[12deg]">
      <Ionicons name="checkmark-circle" size={60} color="black" />
    </View>
    <Text className="text-white text-[32px] font-black mb-4 text-center leading-tight">You're all set!</Text>
    <Text className="text-white/50 text-center text-lg px-4 leading-relaxed font-bold">
      Your profile is ready. Now you can find and host matches near you.
    </Text>
  </View>
);

const SectionHeader = ({ title }) => (
  <View className="flex-row items-center justify-between mt-10 mb-5 px-1">
    <Text className="text-white/40 text-[11px] font-black tracking-[2px] uppercase">{title}</Text>
    <View className="h-[1px] flex-1 bg-white/5 ml-4" />
  </View>
);

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
          [category]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
        };
      }
      return { ...prev, [category]: value };
    });
  };

  const handleNext = () => {
    if (currentSlide < 2) setCurrentSlide(currentSlide + 1);
    else router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full">
        <OnboardingHeader
          currentStep={currentSlide + 1}
          totalSteps={3}
          canGoBack={currentSlide > 0}
          onBack={() => setCurrentSlide(currentSlide - 1)}
        />

        <View className="flex-1">
          {currentSlide === 0 && <StepOne selections={selections} toggleSelection={toggleSelection} />}
          {currentSlide === 1 && <StepTwo selections={selections} toggleSelection={toggleSelection} />}
          {currentSlide === 2 && <StepThree />}
        </View>

        {/* Bottom Button */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleNext}
            className="w-full h-16 bg-amber-400 rounded-[24px] flex-row items-center justify-center shadow-lg"
          >
            <Text className="text-black font-black text-[15px] tracking-[2px]">
              {currentSlide === 2 ? "GET STARTED" : "CONTINUE"}
            </Text>
            <Ionicons 
              name={currentSlide === 2 ? "rocket" : "arrow-forward"} 
              size={18} 
              color="#000" 
              style={{ marginLeft: 12 }} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
