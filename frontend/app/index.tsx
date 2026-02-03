import { Redirect } from "expo-router";
import "../global.css";

export default function RootIndex() {
  // This will eventually check if the user is authenticated
  // For now, we redirect to login
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
