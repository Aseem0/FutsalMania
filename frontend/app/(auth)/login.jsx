import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { login } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthInput from "../../components/AuthInput";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!username || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await login({ username, password });

      if (response.status === 200) {
        const { accessToken, role } = response.data.userData;
        const name = response.data.userData.username;

        await AsyncStorage.setItem("userToken", accessToken);
        await AsyncStorage.setItem("username", name);
        await AsyncStorage.setItem("userRole", role);

        setSuccessMessage(`Welcome back, ${name}! Redirecting...`);

        setTimeout(() => {
          if (role === "admin") {
            router.replace("/(tabs)");
          } else {
            router.replace("/(onboarding)");
          }
        }, 1500);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid credentials. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputEmoji = (setter) => (val) => {
    setErrorMessage("");
    setter(val);
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />

        <View className="flex-1 max-w-[430px] w-full mx-auto justify-center">
          {/* Header */}
          <View className="h-[25vh] flex flex-col justify-end px-8 pb-8">
            <View className="mb-4">
              <MaterialCommunityIcons name="soccer" size={36} color="#ffffff" />
            </View>
            <Text className="text-white text-[40px] font-outfit-bold leading-tight tracking-tight">
              Welcome
            </Text>
          </View>

          {/* Form */}
          <View className="px-8 pb-10">
            {successMessage ? (
              <View className="bg-green-500/10 border border-green-500/50 p-4 rounded-lg mb-6 flex-row items-center">
                <MaterialCommunityIcons name="check-circle" size={20} color="#22c55e" />
                <Text className="text-green-500 text-sm font-inter-medium ml-2 flex-1">
                  {successMessage}
                </Text>
              </View>
            ) : null}

            {errorMessage ? (
              <View className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg mb-6 flex-row items-center">
                <MaterialCommunityIcons name="alert-circle" size={20} color="#ef4444" />
                <Text className="text-red-500 text-sm font-inter-medium ml-2 flex-1">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            <AuthInput
              label="Username"
              value={username}
              onChangeText={handleInputEmoji(setUsername)}
            />

            <AuthInput
              label="Password"
              value={password}
              onChangeText={handleInputEmoji(setPassword)}
              isPassword
            />

            <TouchableOpacity 
              onPress={() => router.push("/(auth)/forgot-password")}
              className="pt-2 mb-8"
            >
              <Text className="text-xs font-inter text-white underline">
                Forgot password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-full bg-amber-400 py-5 items-center rounded-lg ${loading ? "opacity-70" : ""}`}
              activeOpacity={0.9}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-black text-sm font-inter-bold uppercase tracking-[0.2em]">
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <View className="flex items-center pt-8">
              <Text className="text-sm font-inter opacity-40 text-white mb-1">
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text className="text-sm font-inter-medium text-amber-400 border-b border-amber-400 pb-0.5 tracking-wide">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

    </Pressable>
  );
}
