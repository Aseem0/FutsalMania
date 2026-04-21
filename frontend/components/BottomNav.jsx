import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import HostChoiceModal from './HostChoiceModal';

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [isHostModalVisible, setIsHostModalVisible] = useState(false);

  const navItems = [
    { name: 'Home', icon: 'home', activeIcon: 'home', path: '/(tabs)' },
    { name: 'Explore', icon: 'compass-outline', activeIcon: 'compass', path: '/explore' },
    { name: 'Tournaments', icon: 'trophy-outline', activeIcon: 'trophy', path: '/tournaments' },
    { name: 'Profile', icon: 'account-outline', activeIcon: 'account', path: '/(tabs)/profile' },
  ];

  const isActive = (path) => {
    if (path === '/(tabs)') return pathname === '/' || pathname === '/(tabs)';
    return pathname === path;
  };

  return (
    <View 
      className="absolute bottom-0 left-0 right-0 max-w-md mx-auto w-full bg-black/95 border-t border-x border-[#1F1F1F] pt-3"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      <View className="flex-row justify-between items-end">
        {navItems.slice(0, 2).map((item) => (
          <TouchableOpacity 
            key={item.name}
            onPress={() => router.push(item.path)}
            className="flex-1 flex-col items-center gap-1"
          >
            <MaterialCommunityIcons 
              name={isActive(item.path) ? item.activeIcon : item.icon} 
              size={24} 
              color={isActive(item.path) ? "#FFB300" : "#A1A1AA"} 
            />
            <Text className={`text-[10px] ${isActive(item.path) ? 'font-bold text-[#FFB300]' : 'font-medium text-[#A1A1AA]'}`}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Floating Action Button */}
        <View className="flex-1 items-center -mt-8">
          <TouchableOpacity 
            onPress={() => setIsHostModalVisible(true)}
            className="h-14 w-14 rounded-full bg-[#FFB300] items-center justify-center"
            activeOpacity={0.9}
            style={{
              boxShadow: '0 0 15px rgba(255, 179, 0, 0.4)',
              elevation: 8,
            }}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#000000" />
            <Text className="text-[9px] font-black text-black uppercase leading-none">
              HOST
            </Text>
          </TouchableOpacity>
        </View>

        <HostChoiceModal 
          visible={isHostModalVisible} 
          onClose={() => setIsHostModalVisible(false)} 
        />

        {navItems.slice(2).map((item) => (
          <TouchableOpacity 
            key={item.name}
            onPress={() => router.push(item.path)}
            className="flex-1 flex-col items-center gap-1"
          >
            <MaterialCommunityIcons 
              name={isActive(item.path) ? item.activeIcon : item.icon} 
              size={24} 
              color={isActive(item.path) ? "#FFB300" : "#A1A1AA"} 
            />
            <Text className={`text-[10px] ${isActive(item.path) ? 'font-bold text-[#FFB300]' : 'font-medium text-[#A1A1AA]'}`}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BottomNav;
