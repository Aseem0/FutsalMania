import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { register } from "../../services/api";
import AuthInput from "../../components/AuthInput";

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    setErrorMessage("");
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await register({ username, email, password });

      if (response.status === 201) {
        // Pass the email to the OTP screen
        router.push({
          pathname: "/(auth)/otp",
          params: { email },
        });
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
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
          <View className="pt-4 px-8 pb-4">
            <View className="mb-4">
              <MaterialCommunityIcons name="soccer" size={32} color="#ffffff" />
            </View>
            <Text className="text-white text-[32px] font-outfit-bold leading-tight tracking-tight">
              Create Account
            </Text>
          </View>

          {/* Form */}
          <View className="px-8 pb-6 mt-5">
            {errorMessage ? (
              <View className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg mb-6 flex-row items-center">
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={20}
                  color="#ef4444"
                />
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
              label="Email Address"
              value={email}
              onChangeText={handleInputEmoji(setEmail)}
              keyboardType="email-address"
            />

            <AuthInput
              label="Password"
              value={password}
              onChangeText={handleInputEmoji(setPassword)}
              isPassword
            />

            <AuthInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={handleInputEmoji(setConfirmPassword)}
              isPassword
            />

            <View className="pt-6">
              <TouchableOpacity
                className={`w-full bg-amber-400 py-4 items-center rounded-lg ${loading ? "opacity-70" : ""}`}
                activeOpacity={0.9}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text className="text-black text-sm font-inter-bold uppercase tracking-[0.2em]">
                  {loading ? "Creating Account..." : "Sign Up"}
                </Text>
              </TouchableOpacity>

              <View className="flex items-center pt-6">
                <Text className="text-sm font-inter opacity-40 text-white mb-1">
                  Already have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/login")}
                >
                  <Text className="text-sm font-inter-medium text-amber-400 border-b border-amber-400 pb-0.5 tracking-wide">
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}
