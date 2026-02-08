import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HostGameScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
      <View style={{ alignItems: "center", padding: 20 }}>
        <MaterialCommunityIcons name="cog" size={64} color="#ccc" />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>Host Game Setup</Text>
        <Text style={{ color: "#666", textAlign: "center", marginTop: 10 }}>
          This page is under setup. Features will be added soon.
        </Text>
        
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ 
            marginTop: 30, 
            paddingVertical: 12, 
            paddingHorizontal: 24, 
            backgroundColor: "black", 
            borderRadius: 8 
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
