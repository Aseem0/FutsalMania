import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  
  // Example states for toggles
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailUpdates: false,
    biometricLogin: true,
    publicProfile: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingItem = ({ icon, title, subtitle, type = 'link', value, onValueChange }) => (
    <TouchableOpacity 
      activeOpacity={type === 'link' ? 0.7 : 1}
      className="flex-row items-center p-4 mb-3 rounded-xl border border-[#1F1F1F] bg-[#121212]"
    >
      <View className="h-10 w-10 rounded-full items-center justify-center bg-black/50 mr-4">
        <MaterialCommunityIcons name={icon} size={22} color="#FFB300" />
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold text-base">{title}</Text>
        {subtitle && <Text className="text-[#A1A1AA] text-xs">{subtitle}</Text>}
      </View>
      
      {type === 'toggle' ? (
        <Switch
          trackColor={{ false: '#1F1F1F', true: '#FFB300' }}
          thumbColor={value ? '#ffffff' : '#A1A1AA'}
          onValueChange={onValueChange}
          value={value}
        />
      ) : (
        <MaterialCommunityIcons name="chevron-right" size={20} color="#3F3F46" />
      )}
    </TouchableOpacity>
  );

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
          <Text className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">Notifications</Text>
          <SettingItem 
            icon="bell-outline" 
            title="Push Notifications" 
            subtitle="Get alerts for match invites"
            type="toggle"
            value={settings.pushNotifications}
            onValueChange={() => toggleSetting('pushNotifications')}
          />
          <SettingItem 
            icon="email-outline" 
            title="Email Updates" 
            subtitle="Weekly newsletters and news"
            type="toggle"
            value={settings.emailUpdates}
            onValueChange={() => toggleSetting('emailUpdates')}
          />

          {/* Security Section */}
          <Text className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[2px] mt-6 mb-4 ml-1">Security</Text>
          <SettingItem 
            icon="fingerprint" 
            title="Biometric Login" 
            subtitle="Use Touch ID or Face ID"
            type="toggle"
            value={settings.biometricLogin}
            onValueChange={() => toggleSetting('biometricLogin')}
          />
          <SettingItem 
            icon="lock-reset" 
            title="Change Password" 
            subtitle="Update your account password"
          />

          {/* Privacy Section */}
          <Text className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[2px] mt-6 mb-4 ml-1">Privacy</Text>
          <SettingItem 
            icon="eye-outline" 
            title="Public Profile" 
            subtitle="Allow others to see your stats"
            type="toggle"
            value={settings.publicProfile}
            onValueChange={() => toggleSetting('publicProfile')}
          />
          <SettingItem 
            icon="shield-account-outline" 
            title="Blocked Users" 
            subtitle="Manage people you've blocked"
          />

          
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
