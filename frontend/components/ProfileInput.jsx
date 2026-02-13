import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileInput = ({ 
  label, 
  value, 
  onChangeText, 
  icon, 
  placeholder, 
  keyboardType = 'default' 
}) => (
  <View className="mb-6">
    <Text className="text-[#A1A1AA] text-xs font-bold uppercase tracking-widest mb-2 ml-1">
      {label}
    </Text>
    <View className="flex-row items-center bg-[#121212] border border-[#1F1F1F] rounded-xl px-4 h-14">
      <View className="mr-3">
        <MaterialCommunityIcons name={icon} size={20} color="#FFB300" />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="flex-1 text-white text-base"
        placeholderTextColor="#3F3F46"
        keyboardType={keyboardType}
        selectionColor="#FFB300"
      />
    </View>
  </View>
);

export default ProfileInput;
