import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function SettingsStep() {
  return (
    <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-black text-white mb-2">Game Settings</Text>
      <Text className="text-white/50 text-sm mb-8 font-medium">
        Configure gameplay and player limits.
      </Text>
      
      {/* Placeholder for Settings Form */}
      <View className="bg-[#111] p-6 rounded-2xl border border-white/5 items-center justify-center py-20">
        <Text className="text-white/30 font-bold italic">Settings form coming soon...</Text>
      </View>
    </ScrollView>
  );
}
