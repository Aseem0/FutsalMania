import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: 'home', activeIcon: 'home', path: '/(tabs)' },
    { name: 'Explore', icon: 'compass-outline', activeIcon: 'compass', path: '/explore' },
    { name: 'Teams', icon: 'trophy-outline', activeIcon: 'trophy', path: '/teams' },
    { name: 'Profile', icon: 'account-outline', activeIcon: 'account', path: '/(tabs)/profile' },
  ];

  const isActive = (path) => {
    if (path === '/(tabs)') return pathname === '/' || pathname === '/(tabs)';
    return pathname === path;
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-black/95 border-t border-[#1F1F1F] pb-3 pt-3">
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
            onPress={() => router.push('/host-game')}
            className="h-14 w-14 rounded-full bg-[#FFB300] items-center justify-center"
            activeOpacity={0.9}
            style={{
              shadowColor: '#FFB300',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 15,
              elevation: 8,
            }}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#000000" />
            <Text className="text-[9px] font-black text-black uppercase leading-none">
              HOST
            </Text>
          </TouchableOpacity>
        </View>

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
