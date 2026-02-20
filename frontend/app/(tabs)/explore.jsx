import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Modular Tab Components
import GamesTab from "../explore/GamesTab";
import PlayersTab from "../explore/PlayersTab";
import TeamsTab from "../explore/TeamsTab";

export default function ExploreScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("GAMES");

  const tabs = ["GAMES", "PLAYERS", "TEAMS"];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header */}
        <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
          <Text className="text-3xl font-black text-white">Explore</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="w-12 h-12 bg-[#111] rounded-full items-center justify-center">
              <Feather name="search" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-12 h-12 bg-[#111] rounded-full items-center justify-center">
              <Feather name="bell" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row px-6 mb-6">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="flex-1 items-center py-4"
            >
              <Text className={`font-black text-xs tracking-widest ${activeTab === tab ? 'text-white' : 'text-white/20'}`}>
                {tab}
              </Text>
              {activeTab === tab && (
                <View className="absolute bottom-0 w-1/2 h-[3px] bg-amber-400 rounded-full" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View className="flex-1">
          {activeTab === "GAMES" ? (
            <GamesTab />
          ) : activeTab === "PLAYERS" ? (
            <PlayersTab />
          ) : (
            <TeamsTab />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
