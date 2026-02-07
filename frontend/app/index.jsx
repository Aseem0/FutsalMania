import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import "../global.css";

export default function RootIndex() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const onboarding = await AsyncStorage.getItem("hasCompletedOnboarding");

        setIsAuthenticated(!!token);
        setHasCompletedOnboarding(onboarding === "true");
      } catch (e) {
        console.error("Failed to check auth/onboarding status", e);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // FORCE ONBOARDING FOR UI TESTING (User request)
  return <Redirect href="/(onboarding)" />;

  /*
  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)" />;
  */
}
