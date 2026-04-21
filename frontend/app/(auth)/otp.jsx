import React, { useState, useEffect } from "react";
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
import { verifyOtp, resendOtp } from "../../services/api";
import AuthInput from "../../components/AuthInput";

export default function OTPScreen() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (otp.length !== 6) {
      setErrorMessage("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtp(email, otp);
      if (response.status === 200) {
        setSuccessMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 2000);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid or expired OTP. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    if (!email) {
      setErrorMessage("No email found to resend to. Please go back and try again.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setResending(true);
    try {
      const response = await resendOtp(email);
      if (response.status === 200) {
        setSuccessMessage("A new OTP has been sent to your email.");
        setTimer(60);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      setErrorMessage(msg);
    } finally {
      setResending(false);
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
              <MaterialCommunityIcons name="email-check-outline" size={36} color="#ffffff" />
            </View>
            <Text className="text-white text-[32px] font-outfit-bold leading-tight tracking-tight">
              Verify Email
            </Text>
            <Text className="text-white/60 text-sm font-inter mt-2">
              We've sent a 6-digit verification code to{"\n"}
              {email || "your email address"}
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

            <View className="pt-6">
              <TouchableOpacity
                className={`w-full bg-amber-400 py-4 items-center rounded-lg ${loading || successMessage ? "opacity-70" : ""}`}
                activeOpacity={0.9}
                onPress={handleVerify}
                disabled={loading || successMessage.length > 0}
              >
                {loading ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <Text className="text-black text-sm font-inter-bold uppercase tracking-[0.2em]">
                    Verify Code
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex items-center pt-8">
                <Text className="text-sm font-inter opacity-40 text-white mb-2">
                  Didn't receive the code?
                </Text>
                <TouchableOpacity 
                  onPress={handleResend}
                  disabled={timer > 0 || resending}
                >
                  <Text className={`text-sm font-inter-medium ${timer > 0 || resending ? "text-white/20" : "text-amber-400 border-b border-amber-400"} pb-0.5 tracking-wide`}>
                    {resending ? "Resending..." : timer > 0 ? `Resend Code in ${timer}s` : "Resend Code"}
                  </Text>
                </TouchableOpacity>
              </View>

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
