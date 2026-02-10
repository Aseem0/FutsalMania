import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header */}
        <View className="bg-black/90 px-4 py-4 border-b border-[#1F1F1F]">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">
              <Text className="italic">FUTSAL</Text>
              <Text className="text-[#FFB300]">MANIA</Text>
            </Text>
            
            <View className="flex-row items-center gap-4">
              <TouchableOpacity className="relative">
                <MaterialCommunityIcons name="bell-outline" size={24} color="#ffffff" />
                <View className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#FFB300] border border-black" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.push("/(auth)/login")}
                className="h-8 w-8 rounded-full items-center justify-center border border-[#1F1F1F] bg-[#121212]"
              >
                <MaterialCommunityIcons name="chevron-left" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView className="flex-1 pb-32" showsVerticalScrollIndicator={false}>
          {/* Welcome */}
          <View className="px-5 pt-8 pb-6">
            <Text className="text-3xl font-bold text-white">
              Welcome back, User!
            </Text>
            <Text className="text-[#A1A1AA] mt-1 text-sm">
              Elevate your performance today
            </Text>
          </View>

          {/* Grid Cards */}
          <View className="px-5">
            <View className="flex-row gap-3 mb-3">
              <TouchableOpacity 
                className="flex-1 flex-col gap-3 rounded-xl border border-[#1F1F1F] bg-[#121212] p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons name="plus-circle-outline" size={32} color="#FFB300" />
                <View>
                  <Text className="font-semibold text-base text-white">Host Game</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-bold">
                    INITIATE
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-1 flex-col gap-3 rounded-xl border border-[#1F1F1F] bg-[#121212] p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons name="magnify" size={32} color="#ffffff" />
                <View>
                  <Text className="font-semibold text-base text-white">Find Game</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-bold">
                    DISCOVER
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity 
                className="flex-1 flex-col gap-3 rounded-xl border border-[#1F1F1F] bg-[#121212] p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons name="account-group-outline" size={32} color="#ffffff" />
                <View>
                  <Text className="font-semibold text-base text-white">Find Players</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-bold">
                    SCOUT
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-1 flex-col gap-3 rounded-xl border border-[#1F1F1F] bg-[#121212] p-5"
                activeOpacity={0.95}
              >
                <MaterialCommunityIcons name="trophy-outline" size={32} color="#ffffff" />
                <View>
                  <Text className="font-semibold text-base text-white">Tournaments</Text>
                  <Text className="text-[10px] text-[#A1A1AA] mt-0.5 uppercase tracking-widest font-bold">
                    CHAMPIONSHIP
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sessions */}
          <View className="mt-10">
            <View className="flex-row items-center justify-between px-5 mb-4">
              <Text className="text-lg font-bold text-white">Scheduled Sessions</Text>
              <TouchableOpacity>
                <Text className="text-xs font-semibold text-[#FFB300] uppercase tracking-wider">
                  ALL ACTIVITY
                </Text>
              </TouchableOpacity>
            </View>

            <View className="px-5 gap-4">
              {/* Session Card 1 */}
              <View className="relative w-full h-56 rounded-xl overflow-hidden border border-[#1F1F1F]">
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATDOIlUYY68EWd7ryupg1pRSygdCIgUkuy1ZUYPHL2Zd5ad1WSJdqMFzR3SqhZD6UGhswmAt_I2pOj02sEZm1QgSyBuDZgmRhCakhut0IZiLn1qROJ6MuO2p5BRhAabuEPUijoN7X5B28nxDbbyzNUv2Zkr7oqrKf-vEOnqMQlQ-uui5552IwOiSMlVbNXam4M-_MxEJ_1_Fl5so5SiAn2R9yyRpOLVb5gdd2R8ODKItDLs-mK10igjPFQQNGzqfgPwt6SkOyQkTl9' }}
                  className="absolute inset-0 w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <View className="relative h-full flex-col justify-between p-5">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="font-bold text-lg text-white">Arena One Sports</Text>
                      <Text className="text-xs text-white/80 font-medium">London • 2.4 miles away</Text>
                    </View>
                    <View className="px-2 py-1 rounded border border-[#1F1F1F] bg-black/60">
                      <Text className="text-[10px] font-bold text-white">TOMORROW</Text>
                    </View>
                  </View>

                  <View className="gap-4">
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons name="clock-outline" size={16} color="#FFB300" />
                      <Text className="text-sm text-white font-semibold">19:00 - 20:30</Text>
                    </View>

                    <View className="gap-2">
                      <View className="flex-row justify-between">
                        <Text className="text-[11px] font-bold uppercase text-white/70">
                          JOINED SQUAD
                        </Text>
                        <Text className="text-[11px] font-bold uppercase text-[#FFB300]">
                          8/10
                        </Text>
                      </View>
                      <View className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <View className="bg-[#FFB300] h-full w-[80%]" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Session Card 2 */}
              <View className="relative w-full h-56 rounded-xl overflow-hidden border border-[#1F1F1F]">
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXSlGGSZCIbzoGVWvk5mAifbMTvc_JOz5OG1ZJkUBCYnfR26xTMvQiMnJdWChYZX9ZMiRiXgwAhtkvi1LlXvf7mFVfIL3hXMB9lP8lyyGaWZvQ7xgjnYLi7GhCEZpNcFRPNC2EEpxDq2ZkASSjAub0vrEKfmWAXnbIrU51MJLMQQowhUFWoRUcyHhZVgmHoHBUMUv5p3fgh3rMg3p6nUkIv3AK3nsfqZyHZhFnaU8g939BuSMcox9ugH6AuPQ44pUOjEAGN7WsCw91' }}
                  className="absolute inset-0 w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <View className="relative h-full flex-col justify-between p-5">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="font-bold text-lg text-white">Downtown Futsal</Text>
                      <Text className="text-xs text-white/80 font-medium">London • 1.1 miles away</Text>
                    </View>
                    <View className="px-2 py-1 rounded border border-[#1F1F1F] bg-black/60">
                      <Text className="text-[10px] font-bold text-white">FRI 22</Text>
                    </View>
                  </View>

                  <View className="gap-4">
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons name="clock-outline" size={16} color="#FFB300" />
                      <Text className="text-sm text-white font-semibold">21:00 - 22:00</Text>
                    </View>

                    <View className="gap-2">
                      <View className="flex-row justify-between">
                        <Text className="text-[11px] font-bold uppercase text-white/70">
                          JOINED SQUAD
                        </Text>
                        <Text className="text-[11px] font-bold uppercase text-[#FFB300]">
                          5/10
                        </Text>
                      </View>
                      <View className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <View className="bg-[#FFB300] h-full w-[50%]" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}
