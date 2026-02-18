import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ProfileOption from '../../components/ProfileOption';
import { fetchUserProfile } from "../../services/api";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const STATS = [
    { label: 'Games', value: '12' },
    { label: 'Rate', value: '85%' },
    { label: 'Points', value: '450', color: '#FFB300' },
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetchUserProfile();
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="#FFB300" />
      </View>
    );
  }

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

        <ScrollView 
          className="flex-1 px-5 pt-8" 
          contentContainerStyle={{ paddingBottom: 100 }} 
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View className="items-center mb-8">
            <View className="relative">
              <View className="h-24 w-24 rounded-full overflow-hidden border-2 border-[#FFB300] bg-[#121212] items-center justify-center">
                {user?.profilePicture ? (
                  <Image 
                    source={{ uri: user.profilePicture }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <MaterialCommunityIcons name="account" size={48} color="#333" />
                )}
              </View>
            </View>
            <Text className="text-2xl font-bold text-white mt-4">{user?.username || 'Player'}</Text>
            <Text className="text-[#A1A1AA] text-sm">Pro Player • Kathmandu, Nepal</Text>
            
            <View className="flex-row gap-8 mt-6">
              {STATS.map((stat, index) => (
                <React.Fragment key={stat.label}>
                  <View className="items-center">
                    <Text className={`font-bold text-lg ${stat.color ? `text-[${stat.color}]` : 'text-white'}`}>{stat.value}</Text>
                    <Text className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest">{stat.label}</Text>
                  </View>
                  {index < STATS.length - 1 && <View className="h-8 w-[1px] bg-[#1F1F1F] self-center" />}
                </React.Fragment>
              ))}
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

          {/* Menu Sections */}
          <View className="mb-10">
            <SectionHeader title="Account" />
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
              onPress={() => router.push('/privacy-settings')}
            />
            
            <SectionHeader title="Statistics" topMargin />
            <ProfileOption 
              icon="chart-bar" 
              title="Performance Insights" 
              subtitle="Track your wins, goals and stats" 
            />
            <ProfileOption 
              icon="history" 
              title="Match History" 
              subtitle="View all your past games" 
              onPress={() => router.push('/match-history')}
            />

            <SectionHeader title="Other" topMargin />
            <ProfileOption 
              icon="help-circle-outline" 
              title="Support & Feedback" 
              onPress={() => router.push('/support-feedback')}
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

const SectionHeader = ({ title, topMargin = false }) => (
  <Text className={`text-[#A1A1AA] text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1 ${topMargin ? 'mt-6' : ''}`}>
    {title}
  </Text>
);

