import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { register } from "../../services/api";

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(false);
    try {
      setLoading(true);
      const response = await register({
        username,
        email,
        password,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-black ">
        <StatusBar barStyle="dark-content" />

        <View className="flex-1 max-w-[430px] w-full mx-auto justify-center">
          {/* Header Section */}
          <View className="pt-4 px-8 pb-4">
            <View className="mb-4">
              <MaterialCommunityIcons name="soccer" size={32} color="#ffffff" />
            </View>

            <Text className="text-white text-[32px] font-bold leading-tight tracking-tight">
              Create Account
            </Text>
          </View>

          {/* Form Container */}
          <View className="px-8 pb-6 mt-5">
            {/* Username Input */}
            <View className="mb-5">
              <Text className="text-[11px] uppercase tracking-[0.15em] font-medium text-white">
                Username
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                className="w-full bg-transparent border-b border-white px-0 py-2 text-base text-white"
              />
            </View>

            {/* Email Input */}
            <View className="mb-5">
              <Text className="text-[11px] uppercase tracking-[0.15em] font-medium text-white">
                Email Address
              </Text>
              <TextInput
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                className="w-full bg-transparent border-b border-white px-0 py-2 text-base text-white"
              />
            </View>

            {/* Password Input */}
            <View className="mb-5">
              <Text className="text-[11px] uppercase tracking-[0.15em] font-medium text-white">
                Password
              </Text>
              <View className="relative flex-row items-center border-b border-white">
                <TextInput
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  className="flex-1 bg-transparent px-0 py-2 text-base text-white"
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

            <View className="mb-5">
              <Text className="text-[11px] uppercase tracking-[0.15em] font-medium text-white">
                Confirm Password
              </Text>
              <View className="relative flex-row items-center border-b border-white">
                <TextInput
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="flex-1 bg-transparent px-0 py-2 text-base text-white"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 p-2"
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#a3a3a3"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* CTA Section */}
            <View className="pt-6">
              <TouchableOpacity
                className={`w-full bg-amber-400 py-4 items-center rounded-lg ${
                  loading ? "opacity-70" : ""
                }`}
                activeOpacity={0.98}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text className="text-black text-sm font-bold uppercase tracking-[0.2em]">
                  {loading ? "Creating Account..." : "Sign Up"}
                </Text>
              </TouchableOpacity>

              <View className="flex items-center pt-6">
                <Text className="text-sm font-light opacity-40 text-white mb-1">
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => router.replace("/login")}>
                  <Text className="text-sm font-medium text-amber-400 border-b border-amber-400 pb-0.5 tracking-wide">
                    Login
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
