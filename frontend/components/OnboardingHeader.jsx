import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingHeader({ currentStep, totalSteps, onBack, canGoBack }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="px-6 pt-2">
      <View className="flex-row items-center justify-between mb-3">
        <TouchableOpacity
          className={`w-11 h-11 items-center justify-center rounded-full bg-zinc-900 border border-white/10 ${
            !canGoBack ? "opacity-0" : "opacity-100"
          }`}
          disabled={!canGoBack}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-sm font-bold text-white/50 tracking-widest">
            Step {currentStep} of {totalSteps}
          </Text>
        </View>

        <View className="w-11" />
      </View>

      {/* Progress Bar */}
      <View className="w-full bg-white/10 h-[4px] rounded-full overflow-hidden">
        <View
          className="bg-amber-400 h-full rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
}
