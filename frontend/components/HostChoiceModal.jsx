import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';

const HostChoiceModal = ({ visible, onClose }) => {
  const router = useRouter();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 items-center justify-center px-4">
        {/* Backdrop for closing */}
        <TouchableOpacity 
          className="absolute inset-0" 
          onPress={onClose} 
          activeOpacity={1}
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
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-white/5 items-center justify-center"
              >
                <MaterialIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <TouchableOpacity 
                onPress={() => {
                  onClose();
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
                  onClose();
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
  );
};

export default HostChoiceModal;
