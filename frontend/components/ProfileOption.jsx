import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileOption = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  color = "#FFB300", 
  type = 'link', 
  value, 
  onValueChange 
}) => {
  const isToggle = type === 'toggle';

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={isToggle ? 1 : 0.7}
      className="flex-row items-center p-4 mb-3 rounded-xl border border-[#1F1F1F] bg-[#121212]"
    >
      <View className="h-10 w-10 rounded-full items-center justify-center bg-black/50 mr-4">
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      
      <View className="flex-1">
        <Text className="text-white font-semibold text-base">{title}</Text>
        {subtitle && <Text className="text-[#A1A1AA] text-xs leading-4 mt-0.5">{subtitle}</Text>}
      </View>

      {isToggle ? (
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
};

export default ProfileOption;
