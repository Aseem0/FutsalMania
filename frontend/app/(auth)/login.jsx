import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { login } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await login({ username, password });

      if (response.status === 200) {
        const { accessToken } = response.data.userData;
        await AsyncStorage.setItem("userToken", accessToken);
        await AsyncStorage.setItem("username", response.data.userData.username);

        router.replace("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data || "Something went wrong. Please try again.";
      // The backend returns a string for error messages in some cases
      Alert.alert(
        "Login Failed",
        typeof errorMessage === "string" ? errorMessage : errorMessage.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="dark-content" />

        <View className="flex-1 max-w-[430px] w-full mx-auto justify-center">
          {/* Large White Space at Top */}
          <View className="h-[25vh] flex flex-col justify-end px-8 pb-8">
            {/* Brand Icon */}
            <View className="mb-4">
              <MaterialCommunityIcons name="soccer" size={36} color="#ffffff" />
            </View>

            <Text className="text-white text-[40px] font-bold leading-tight tracking-tight">
              Welcome
            </Text>
          </View>

          {/* Login Form Container */}
          <View className="px-8 pb-10">
            {/* Username Input */}
            <View className="mb-6">
              <Text className="text-[11px] uppercase tracking-widest font-medium text-white">
                Username
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                className="w-full bg-transparent border-b border-white px-0 py-3 text-base text-white"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-[11px] uppercase tracking-widest font-medium text-white">
                Password
              </Text>
              <View className="relative flex-row items-center border-b border-white">
                <TextInput
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  className="flex-1 bg-transparent px-0 py-3 text-base text-white"
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
                <Text className="text-xs font-light text-white underline">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* CTA Section */}
            <View className="pt-4">
              <TouchableOpacity
                className={`w-full bg-white py-5 items-center rounded-lg ${
                  loading ? "opacity-70" : ""
                }`}
                activeOpacity={0.98}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text className="text-black text-sm font-bold uppercase tracking-[0.2em]">
                  {loading ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>

              <View className="flex items-center pt-8">
                <Text className="text-sm font-light opacity-40 text-white mb-1">
                  Don't have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text className="text-sm font-medium text-white border-b border-white pb-0.5 tracking-wide">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
