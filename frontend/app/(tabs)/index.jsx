import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#f7f7f7] dark:bg-black">
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 max-w-md mx-auto w-full border-x border-zinc-100 dark:border-zinc-900">
        {/* Fixed Top Header */}
        <View className="bg-[#f7f7f7]/80 dark:bg-black/80 px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold tracking-tight text-black dark:text-white">
              FutsalMania
            </Text>

            <View className="flex-row items-center gap-4">
              {/* Notification Icon */}
              <TouchableOpacity className="relative">
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
                  color="#ffffff"
                />
                <View className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border border-black" />
              </TouchableOpacity>

              {/* Back Button (Login) */}
              <TouchableOpacity 
                onPress={() => router.replace('/login')}
                className="h-8 w-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800"
              >
                <MaterialCommunityIcons name="arrow-left" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          className="flex-1 pb-24"
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View className="px-5 pt-8 pb-6">
            <Text className="text-3xl font-bold tracking-tight text-black dark:text-white">
              Welcome back, User!
            </Text>
            <Text className="text-zinc-500 dark:text-zinc-400 mt-1">
              Find your next match
            </Text>
          </View>

          {/* 2x2 Grid Section */}
          <View className="px-5">
            <View className="flex-row gap-3 mb-3">
              {/* Host Game */}
              <TouchableOpacity
                className="flex-1 flex-col gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  size={32}
                  color="#ffffff"
                />
                <View>
                  <Text className="font-semibold text-base leading-tight text-black dark:text-white">
                    Host Game
                  </Text>
                  <Text className="text-xs text-zinc-500 mt-0.5">
                    Create match
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Find Game */}
              <TouchableOpacity
                className="flex-1 flex-col gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={32}
                  color="#ffffff"
                />
                <View>
                  <Text className="font-semibold text-base leading-tight text-black dark:text-white">
                    Find Game
                  </Text>
                  <Text className="text-xs text-zinc-500 mt-0.5">
                    Join match
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-3">
              {/* Find Players */}
              <TouchableOpacity
                className="flex-1 flex-col gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons
                  name="account-group-outline"
                  size={32}
                  color="#ffffff"
                />
                <View>
                  <Text className="font-semibold text-base leading-tight text-black dark:text-white">
                    Find Players
                  </Text>
                  <Text className="text-xs text-zinc-500 mt-0.5">
                    Scout talent
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Find Teams */}
              <TouchableOpacity
                className="flex-1 flex-col gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons
                  name="shield-outline"
                  size={32}
                  color="#ffffff"
                />
                <View>
                  <Text className="font-semibold text-base leading-tight text-black dark:text-white">
                    Find Teams
                  </Text>
                  <Text className="text-xs text-zinc-500 mt-0.5">
                    Join club
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Your Upcoming Games Section */}
          <View className="mt-10">
            <View className="flex-row items-center justify-between px-5 mb-4">
              <Text className="text-lg font-bold tracking-tight text-black dark:text-white">
                Your Upcoming Games
              </Text>
              <TouchableOpacity>
                <Text className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-5"
              contentContainerStyle={{ gap: 16 }}
            >
              {/* Game Card 1 */}
              <View className="w-72 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black p-4">
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="font-bold text-sm text-black dark:text-white">
                      Arena One Sports
                    </Text>
                    <Text className="text-xs text-zinc-500">
                      London • 2.4 miles away
                    </Text>
                  </View>
                  <View className="px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                    <Text className="text-[10px] font-bold text-black dark:text-white">
                      TOMORROW
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color="#a3a3a3"
                  />
                  <Text className="text-xs text-zinc-400">19:00 - 20:30</Text>
                </View>

                <View>
                  <View className="flex-row justify-between mb-1.5">
                    <Text className="text-[10px] font-medium uppercase tracking-tighter text-black dark:text-white">
                      Players Joined
                    </Text>
                    <Text className="text-[10px] font-medium uppercase tracking-tighter text-black dark:text-white">
                      8/10
                    </Text>
                  </View>
                  <View className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <View className="bg-white h-full w-[80%]" />
                  </View>
                </View>
              </View>

              {/* Game Card 2 */}
              <View className="w-72 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black p-4">
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="font-bold text-sm text-black dark:text-white">
                      Downtown Futsal
                    </Text>
                    <Text className="text-xs text-zinc-500">
                      London • 1.1 miles away
                    </Text>
                  </View>
                  <View className="px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                    <Text className="text-[10px] font-bold text-black dark:text-white">
                      FRI 22
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color="#a3a3a3"
                  />
                  <Text className="text-xs text-zinc-400">21:00 - 22:00</Text>
                </View>

                <View>
                  <View className="flex-row justify-between mb-1.5">
                    <Text className="text-[10px] font-medium uppercase tracking-tighter text-black dark:text-white">
                      Players Joined
                    </Text>
                    <Text className="text-[10px] font-medium uppercase tracking-tighter text-black dark:text-white">
                      5/10
                    </Text>
                  </View>
                  <View className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <View className="bg-white h-full w-[50%]" />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View className="absolute bottom-0 left-0 right-0 bg-[#f7f7f7]/90 dark:bg-black/90 border-t border-zinc-200 dark:border-zinc-800 pb-8 pt-3 px-6">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity className="flex-col items-center gap-1 border border-black rounded-lg p-1">
              <MaterialCommunityIcons name="home" size={24} color="#ffffff" />
              <Text className="text-[10px] font-bold text-black dark:text-white">
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-col items-center gap-1">
              <MaterialCommunityIcons name="soccer" size={24} color="#a3a3a3" />
              <Text className="text-[10px] font-medium text-zinc-400">
                Matches
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-col items-center gap-1">
              <MaterialCommunityIcons
                name="chart-bar"
                size={24}
                color="#a3a3a3"
              />
              <Text className="text-[10px] font-medium text-zinc-400">
                Rankings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-col items-center gap-1">
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color="#a3a3a3"
              />
              <Text className="text-[10px] font-medium text-zinc-400">
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* iOS Home Indicator Background */}
        <View className="absolute bottom-0 w-full h-8 bg-[#f7f7f7] dark:bg-black pointer-events-none" />
      </View>
    </SafeAreaView>
  );
}
