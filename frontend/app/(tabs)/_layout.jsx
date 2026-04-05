import React, { useEffect, useState } from 'react';
import { Slot, useRouter, usePathname } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import BottomNav from '../../components/BottomNav';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        // If no token exists, immediately redirect to root to let the global guard handle it
        router.replace("/");
      } else {
        setIsReady(true);
      }
    };
    checkAuth();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#fbbf24" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Slot />
      <BottomNav />
    </View>
  );
}
