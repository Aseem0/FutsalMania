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

export default function ProfileScreen() {
  const router = useRouter();

  const ProfileOption = ({ icon, title, subtitle, onPress, color = "#ffffff" }) => (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center p-4 mb-3 rounded-xl border border-[#1F1F1F] bg-[#121212]"
      activeOpacity={0.7}
    >
      <View className="h-10 w-10 rounded-full items-center justify-center bg-black/50 mr-4">
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold text-base">{title}</Text>
        {subtitle && <Text className="text-[#A1A1AA] text-xs">{subtitle}</Text>}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#3F3F46" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header */}
        <View className="bg-black/90 px-4 py-4 border-b border-[#1F1F1F]">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <MaterialCommunityIcons name="chevron-left" size={28} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Profile</Text>
            <TouchableOpacity className="p-2">
              <MaterialCommunityIcons name="cog-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-5 pt-8" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View className="items-center mb-8">
            <View className="relative">
              <View className="h-24 w-24 rounded-full overflow-hidden border-2 border-[#FFB300] bg-[#121212]">
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp8uv1e1BERfNA1lgYs3CMdujbEPzlE_zcAFcsMrONKO5AoXuaeVfLOQFwqQ2VYTCyGPI_747tBOMcUE03hbmjiqBYNqOHXKF4lPN6fnGxwxJfP-sYRThu0ia7uMYJQlKR6BLgbTpWF_6s5PCbSKYwcUx8T2uwUtSMRTmn9pYBM0h1Ze_l9QL_U1q4eZd_9LzWpmOawBgvGuENm7Nez2rVyo9uVrvbQT-rzDS_3Fx4yNLVNmEq67bVXWcvgXU5dR9ouZSoaSWP4rw5' }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 bg-[#FFB300] h-7 w-7 rounded-full items-center justify-center border-2 border-black">
                <MaterialCommunityIcons name="pencil" size={14} color="black" />
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-bold text-white mt-4">Aseem Rai</Text>
            <Text className="text-[#A1A1AA] text-sm">Pro Player • London, UK</Text>
            
            <View className="flex-row gap-8 mt-6">
              <View className="items-center">
                <Text className="text-white font-bold text-lg">12</Text>
                <Text className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest">Games</Text>
              </View>
              <View className="h-8 w-[1px] bg-[#1F1F1F] self-center" />
              <View className="items-center">
                <Text className="text-white font-bold text-lg">85%</Text>
                <Text className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest">Rate</Text>
              </View>
              <View className="h-8 w-[1px] bg-[#1F1F1F] self-center" />
              <View className="items-center">
                <Text className="text-[#FFB300] font-bold text-lg">450</Text>
                <Text className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest">Points</Text>
              </View>
            </View>
          </View>

          {/* Player Attributes */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 items-center justify-center p-4 rounded-2xl border border-[#1F1F1F] bg-[#121212]">
              <View className="h-9 w-9 rounded-full items-center justify-center bg-black/40 mb-2 border border-[#1F1F1F]">
                <MaterialCommunityIcons name="soccer" size={18} color="#FFB300" />
              </View>
              <Text className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest mb-0.5">Position</Text>
              <Text className="text-white font-bold text-base">Forward</Text>
            </View>

            <View className="flex-1 items-center justify-center p-4 rounded-2xl border border-[#1F1F1F] bg-[#121212]">
              <View className="h-9 w-9 rounded-full items-center justify-center bg-black/40 mb-2 border border-[#1F1F1F]">
                <MaterialCommunityIcons name="trending-up" size={18} color="#FFB300" />
              </View>
              <Text className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest mb-0.5">Skill Level</Text>
              <Text className="text-white font-bold text-base">Advanced</Text>
            </View>
          </View>

          {/* Menu Options */}
          <View className="mb-10">
            <Text className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">Account</Text>
            <ProfileOption 
              icon="account-outline" 
              title="Personal Information" 
              subtitle="Edit your name, email, and location" 
              onPress={() => router.push('/personal-info')}
            />
            <ProfileOption 
              icon="shield-check-outline" 
              title="Privacy & Security" 
              subtitle="Password, biometric login" 
            />
            
            <Text className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[2px] mt-6 mb-4 ml-1">Statistics</Text>
            <ProfileOption 
              icon="chart-bar" 
              title="Performance Insights" 
              subtitle="Track your wins, goals and stats" 
            />
            <ProfileOption 
              icon="history" 
              title="Match History" 
              subtitle="View all your past games" 
            />

            <Text className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[2px] mt-6 mb-4 ml-1">Other</Text>
            <ProfileOption 
              icon="help-circle-outline" 
              title="Support & Feedback" 
            />
            <ProfileOption 
              icon="logout-variant" 
              title="Logout" 
              onPress={() => router.replace('/(auth)/login')}
              color="#F87171"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
