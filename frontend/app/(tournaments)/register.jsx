import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Pressable,
  Keyboard,
  Alert,
} from "react-native";
import SuccessModal from "../../components/SuccessModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { registerTournament } from "../../services/api";

export default function RegisterTournamentScreen() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  
  const [teamName, setTeamName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [playersList, setPlayersList] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRegister = async () => {
    if (!teamName || !contactNumber || !playersList) {
      setErrorMessage("All fields (Team, Contact, and Players) are required");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    
    try {
      const response = await registerTournament(id, {
        teamName,
        contactNumber,
        playersList
      });

      if (response.status === 201) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Tournament registration error:", error);
      const msg = error.response?.data?.message || "Failed to register. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />
        
        <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
          {/* Header */}
          <View className="flex-row items-center px-6 py-6 border-b border-white/5">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="mr-4"
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-outfit-bold italic uppercase tracking-tighter">
              Register Team
            </Text>
          </View>

          <ScrollView className="flex-1 px-6 pt-8">
            <View className="mb-8">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Tournament</Text>
              <Text className="text-white text-2xl font-black uppercase tracking-tighter leading-8">
                {name}
              </Text>
            </View>

            {errorMessage ? (
              <View className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl mb-8 flex-row items-center">
                <MaterialIcons name="error-outline" size={20} color="#ef4444" />
                <Text className="text-red-500 text-xs font-inter-medium ml-2 flex-1">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Form Fields */}
            <View className="mb-6">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3 ml-1">Team Name</Text>
              <TextInput
                value={teamName}
                onChangeText={setTeamName}
                placeholder="Enter your team name"
                placeholderTextColor="#3f3f46"
                className="bg-zinc-900 border border-white/5 p-5 rounded-2xl text-white font-inter-medium"
              />
            </View>

            <View className="mb-6">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3 ml-1">Contact Number</Text>
              <TextInput
                value={contactNumber}
                onChangeText={setContactNumber}
                placeholder="e.g. +977 98XXXXXXXX"
                placeholderTextColor="#3f3f46"
                keyboardType="phone-pad"
                className="bg-zinc-900 border border-white/5 p-5 rounded-2xl text-white font-inter-medium"
              />
            </View>

            <View className="mb-10">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3 ml-1">Players List</Text>
              <TextInput
                value={playersList}
                onChangeText={setPlayersList}
                placeholder="Enter player names (comma separated)"
                placeholderTextColor="#3f3f46"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-zinc-900 border border-white/5 p-5 rounded-2xl text-white font-inter-medium h-32"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRegister}
              disabled={loading}
              className={`bg-amber-400 py-6 rounded-[32px] items-center justify-center mb-10 shadow-xl shadow-amber-400/20 ${loading ? "opacity-50" : ""}`}
            >
              {loading ? (
                <ActivityIndicator color="black" />
              ) : (
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="trophy-variant-outline" size={20} color="black" className="mr-2" />
                  <Text className="text-black font-black text-md uppercase tracking-[4px] ml-2">Submit Entry</Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>

      <SuccessModal 
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.replace('/(tabs)');
        }}
        title="Registered!"
        message="Your team has been registered for the tournament."
      />
    </Pressable>
  );
}
