import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { forgotPassword } from "../../services/api";
import AuthInput from "../../components/AuthInput";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendCode = async () => {
    setErrorMessage("");
    if (!email) {
      setErrorMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword(email);
      if (response.status === 200) {
        // Redirect to Reset Password screen
        router.push({
          pathname: "/(auth)/reset-password",
          params: { email }
        });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send reset code. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />

        <View className="flex-1 max-w-[430px] w-full mx-auto justify-center">
          {/* Header */}
          <View className="pt-4 px-8 pb-4">
            <View className="mb-4">
              <MaterialCommunityIcons name="lock-reset" size={40} color="#ffffff" />
            </View>
            <Text className="text-white text-[32px] font-outfit-bold leading-tight tracking-tight">
              Forgot Password
            </Text>
            <Text className="text-white/60 text-sm font-inter mt-2">
              Enter the email address associated with your account and we'll send you a 6-digit code.
            </Text>
          </View>

          {/* Form */}
          <View className="px-8 pb-6 mt-5">
            {errorMessage ? (
              <View className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg mb-6 flex-row items-center">
                <MaterialCommunityIcons name="alert-circle" size={20} color="#ef4444" />
                <Text className="text-red-500 text-sm font-inter-medium ml-2 flex-1">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            <AuthInput
              label="Email Address"
              value={email}
              onChangeText={(val) => {
                setErrorMessage("");
                setEmail(val);
              }}
              keyboardType="email-address"
              placeholder="example@gmail.com"
            />

            <View className="pt-6">
              <TouchableOpacity
                className={`w-full bg-amber-400 py-4 items-center rounded-lg ${loading ? "opacity-70" : ""}`}
                activeOpacity={0.9}
                onPress={handleSendCode}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <Text className="text-black text-sm font-inter-bold uppercase tracking-[0.2em]">
                    Send Reset Code
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.replace("/(auth)/login")}
                className="mt-10 items-center"
              >
                <Text className="text-white/40 text-xs font-inter underline">
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}
