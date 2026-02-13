import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ProfileOption from '../../components/ProfileOption';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailUpdates: false,
    biometricLogin: true,
    publicProfile: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
            <Text className="text-xl font-bold text-white ml-2">Privacy & Security</Text>
          </View>
        </View>

        <ScrollView 
          className="flex-1 px-5 pt-8" 
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Notifications Section */}
          <SectionHeader title="Notifications" />
          <ProfileOption 
            icon="bell-outline" 
            title="Push Notifications" 
            subtitle="Get alerts for match invites"
            type="toggle"
            value={settings.pushNotifications}
            onValueChange={() => toggleSetting('pushNotifications')}
          />
          <ProfileOption 
            icon="email-outline" 
            title="Email Updates" 
            subtitle="Weekly newsletters and news"
            type="toggle"
            value={settings.emailUpdates}
            onValueChange={() => toggleSetting('emailUpdates')}
          />

          {/* Security Section */}
          <SectionHeader title="Security" topMargin />
          <ProfileOption 
            icon="fingerprint" 
            title="Biometric Login" 
            subtitle="Use Touch ID or Face ID"
            type="toggle"
            value={settings.biometricLogin}
            onValueChange={() => toggleSetting('biometricLogin')}
          />
          <ProfileOption 
            icon="lock-reset" 
            title="Change Password" 
            subtitle="Update your account password"
          />

          {/* Privacy Section */}
          <SectionHeader title="Privacy" topMargin />
          <ProfileOption 
            icon="eye-outline" 
            title="Public Profile" 
            subtitle="Allow others to see your stats"
            type="toggle"
            value={settings.publicProfile}
            onValueChange={() => toggleSetting('publicProfile')}
          />
          <ProfileOption 
            icon="shield-account-outline" 
            title="Blocked Users" 
            subtitle="Manage people you've blocked"
          />
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

