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
import { router, useLocalSearchParams } from "expo-router";
import { resetPassword } from "../../services/api";
import AuthInput from "../../components/AuthInput";

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleReset = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!otp || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage("Enter the 6-digit code");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({ email, otp, newPassword });
      if (response.status === 200) {
        setSuccessMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 2000);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid code or failed to reset password.";
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
              <MaterialCommunityIcons name="shield-key-outline" size={40} color="#ffffff" />
            </View>
            <Text className="text-white text-[32px] font-outfit-bold leading-tight tracking-tight">
              Reset Password
            </Text>
            <Text className="text-white/60 text-sm font-inter mt-2">
              Enter the code sent to {email} and your new password.
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

            {successMessage ? (
              <View className="bg-green-500/10 border border-green-500/50 p-4 rounded-lg mb-6 flex-row items-center">
                <MaterialCommunityIcons name="check-circle" size={20} color="#22c55e" />
                <Text className="text-green-500 text-sm font-inter-medium ml-2 flex-1">
                  {successMessage}
                </Text>
              </View>
            ) : null}

            <AuthInput
              label="Verification Code"
              value={otp}
              onChangeText={(val) => {
                setErrorMessage("");
                setOtp(val.replace(/[^0-9]/g, "").slice(0, 6));
              }}
              keyboardType="number-pad"
              placeholder="123456"
            />

            <AuthInput
              label="New Password"
              value={newPassword}
              onChangeText={(val) => {
                setErrorMessage("");
                setNewPassword(val);
              }}
              isPassword
            />

            <AuthInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={(val) => {
                setErrorMessage("");
                setConfirmPassword(val);
              }}
              isPassword
            />

            <View className="pt-6">
              <TouchableOpacity
                className={`w-full bg-amber-400 py-4 items-center rounded-lg ${loading || successMessage ? "opacity-70" : ""}`}
                activeOpacity={0.9}
                onPress={handleReset}
                disabled={loading || successMessage.length > 0}
              >
                {loading ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <Text className="text-black text-sm font-inter-bold uppercase tracking-[0.2em]">
                    Update Password
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}
