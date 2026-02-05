import { Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  // Logic for authentication can be added here
  // For now, it just sets up the Stack

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
