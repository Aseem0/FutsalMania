import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [isHostModalVisible, setIsHostModalVisible] = useState(false);

  const navItems = [
    { name: 'Home', icon: 'home', activeIcon: 'home', path: '/(tabs)' },
    { name: 'Explore', icon: 'compass-outline', activeIcon: 'compass', path: '/explore' },
    { name: 'Tournaments', icon: 'trophy-outline', activeIcon: 'trophy', path: '/teams' },
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

        {/* Selection Modal */}
        <Modal
          visible={isHostModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsHostModalVisible(false)}
        >
          <View className="flex-1 bg-black/80 items-center justify-center px-4">
            {/* Backdrop for closing */}
            <Pressable 
              className="absolute inset-0" 
              onPress={() => setIsHostModalVisible(false)} 
            />
            
            {/* Modal Content */}
            <View className="bg-[#111] w-full max-w-sm rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
              <View className="p-8">
                <View className="flex-row items-center justify-between mb-8">
                  <View>
                    <Text className="text-white font-black text-2xl uppercase tracking-tighter">Host Game</Text>
                    <Text className="text-white/40 text-[10px] font-bold uppercase tracking-[2px] mt-1">Select Match Type</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setIsHostModalVisible(false)}
                    className="w-8 h-8 rounded-full bg-white/5 items-center justify-center"
                  >
                    <MaterialIcons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                <View className="gap-4">
                  <TouchableOpacity 
                    onPress={() => {
                      setIsHostModalVisible(false);
                      router.push('/host-game');
                    }}
                    className="flex-row items-center p-5 bg-[#1A1A1A] rounded-2xl border border-white/5 gap-4"
                    activeOpacity={0.7}
                  >
                    <View className="w-12 h-12 rounded-xl bg-amber-400 items-center justify-center">
                      <MaterialCommunityIcons name="account-group" size={24} color="black" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-black text-sm uppercase">Solo Hosting</Text>
                      <Text className="text-white/40 text-[9px] font-medium leading-tight mt-1">Post a match where individuals can join and play together.</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => {
                      setIsHostModalVisible(false);
                      router.push('/team-host');
                    }}
                    className="flex-row items-center p-5 bg-[#1A1A1A] rounded-2xl border border-white/5 gap-4"
                    activeOpacity={0.7}
                  >
                    <View className="w-12 h-12 rounded-xl bg-amber-400 items-center justify-center">
                      <FontAwesome5 name="fist-raised" size={20} color="black" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-black text-sm uppercase">Team vs Team</Text>
                      <Text className="text-white/40 text-[9px] font-medium leading-tight mt-1">Find an opponent squad for your team and play a match.</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

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
