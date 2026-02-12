import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AuthInput({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  icon, 
  isPassword = false, 
  keyboardType = 'default',
  autoCapitalize = 'none'
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-6">
      {label && (
        <Text className="text-[11px] uppercase tracking-widest font-medium text-white mb-1">
          {label}
        </Text>
      )}
      <View className="relative flex-row items-center border-b border-white">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#52525B"
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          className="flex-1 bg-transparent px-0 py-3 text-base text-white"
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-2"
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#a3a3a3"
            />
          </TouchableOpacity>
        )}
        {!isPassword && icon && (
          <View className="p-2">
            <MaterialCommunityIcons name={icon} size={20} color="#a3a3a3" />
          </View>
        )}
      </View>
    </View>
  );
}
