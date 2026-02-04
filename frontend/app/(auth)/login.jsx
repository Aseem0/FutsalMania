import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />

        <View className="flex-1 max-w-[430px] w-full mx-auto">
          {/* Large White Space at Top */}
          <View className="h-[30vh] md:h-[35vh] flex flex-col justify-end px-8 pb-12">
            {/* Brand Icon */}
            <View className="mb-4">
              <MaterialCommunityIcons name="soccer" size={36} color="#000000" />
            </View>

            <Text className="text-black text-[40px] font-bold leading-tight tracking-tight">
              Welcome
            </Text>
          </View>

          {/* Login Form Container */}
          <View className="flex-1 px-8">
            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-[11px] uppercase tracking-widest font-medium text-black opacity-60 mb-2">
                Email Address
              </Text>
              <TextInput
                placeholder="name@example.com"
                placeholderTextColor="#d4d4d4"
                className="w-full bg-transparent border-b border-black px-0 py-3 text-base text-black"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-[11px] uppercase tracking-widest font-medium text-black opacity-60 mb-2">
                Password
              </Text>
              <View className="relative flex-row items-center border-b border-black">
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#d4d4d4"
                  secureTextEntry={!showPassword}
                  className="flex-1 bg-transparent px-0 py-3 text-base text-black"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-0 p-2"
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#a3a3a3"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <View className="pt-2 mb-6">
              <TouchableOpacity>
                <Text className="text-xs font-light text-black opacity-50 underline">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* CTA Section */}
            <View className="pt-10">
              <TouchableOpacity
                className="w-full bg-black  py-5 items-center rounded-lg"
                activeOpacity={0.98}
              >
                <Text className="text-white text-sm font-bold uppercase tracking-[0.2em]">
                   Login
                </Text>
              </TouchableOpacity>

              <View className="flex items-center pt-8">
                <Text className="text-sm font-light opacity-40 text-black mb-1">
                  Don't have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text className="text-sm font-medium text-black  border-b border-black pb-0.5 tracking-wide">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Decorative Bottom Bar (iOS Home Indicator Space) */}
          <View className="h-12 flex items-center justify-center">
            <View className="w-32 h-1 bg-black/10 dark:bg-white/10 rounded-full" />
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
