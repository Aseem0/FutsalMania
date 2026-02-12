import React, { useState } from "react";
import {
  View,
  Text,
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
import AuthInput from "../../components/AuthInput";

export default function LoginScreen() {
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

        router.replace("/(onboarding)");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data || "Something went wrong. Please try again.";
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
        <StatusBar barStyle="light-content" />

        <View className="flex-1 max-w-[430px] w-full mx-auto justify-center">
          {/* Header */}
          <View className="h-[25vh] flex flex-col justify-end px-8 pb-8">
            <View className="mb-4">
              <MaterialCommunityIcons name="soccer" size={36} color="#ffffff" />
            </View>
            <Text className="text-white text-[40px] font-bold leading-tight tracking-tight">
              Welcome
            </Text>
          </View>

          {/* Form */}
          <View className="px-8 pb-10">
            <AuthInput
              label="Username"
              value={username}
              onChangeText={setUsername}
            />

            <AuthInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              isPassword
            />

            <TouchableOpacity className="pt-2 mb-8">
              <Text className="text-xs font-light text-white underline">
                Forgot password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-full bg-amber-400 py-5 items-center rounded-lg ${loading ? "opacity-70" : ""}`}
              activeOpacity={0.9}
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
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text className="text-sm font-medium text-amber-400 border-b border-amber-400 pb-0.5 tracking-wide">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
