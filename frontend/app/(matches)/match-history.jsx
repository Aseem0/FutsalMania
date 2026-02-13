import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MatchHistoryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header */}
        <View className="bg-black/90 px-4 py-4 border-b border-[#1F1F1F]">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <MaterialCommunityIcons name="chevron-left" size={28} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white ml-2">Match History</Text>
          </View>
        </View>

        <ScrollView 
          className="flex-1 px-5 pt-8" 
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center justify-center pt-20">
            <MaterialCommunityIcons name="calendar-clock" size={80} color="#1F1F1F" />
            <Text className="text-white text-xl font-bold mt-6">No Match History</Text>
            <Text className="text-[#A1A1AA] text-center mt-2 px-10">
              You haven't played any matches yet. Host or join a match to see it here!
            </Text>
            
            <TouchableOpacity 
              className="bg-[#FFB300] px-8 h-12 rounded-full items-center justify-center mt-10"
              onPress={() => router.push('/host-game')}
            >
              <Text className="text-black font-bold uppercase tracking-widest text-xs">Host Your First Game</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
