import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createTournament, fetchArenas } from "../services/api";

export default function CreateTournamentScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [arenas, setArenas] = useState([]);
  const [selectedArena, setSelectedArena] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    entryFee: "",
    prizePool: "",
    maxTeams: "",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop", // Default image
  });

  useEffect(() => {
    const fetchArenasData = async () => {
      try {
        const res = await fetchArenas();
        setArenas(res.data);
      } catch (error) {
        console.error("Fetch arenas error:", error);
      }
    };
    fetchArenasData();
  }, []);

  const handleCreate = async () => {
    const { name, date, entryFee, maxTeams } = formData;
    
    if (!name || !date || !selectedArena || !entryFee || !maxTeams) {
      Alert.alert("Error", "Please fill in all required fields and select an arena");
      return;
    }

    try {
      setLoading(true);
      await createTournament({
        ...formData,
        location: selectedArena.name,
        entryFee: parseInt(entryFee),
        maxTeams: parseInt(maxTeams),
        date: new Date(date).toISOString(),
      });
      Alert.alert("Success", "Tournament posted successfully!");
      router.back();
    } catch (error) {
      console.error("Create tournament error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to create tournament");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        <View className="flex-row items-center px-6 py-4 border-b border-[#1F1F1F]">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-black text-white uppercase tracking-tighter">New Tournament</Text>
        </View>

        <ScrollView 
          className="flex-1 px-6 pt-6"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View className="mb-6">
            <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-2">Event Name *</Text>
            <TextInput
              placeholder="e.g. Futsal Mania Cup 2026"
              placeholderTextColor="#444"
              className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 text-white font-bold"
              value={formData.name}
              onChangeText={(val) => setFormData({ ...formData, name: val })}
            />
          </View>

          <View className="mb-6">
            <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-2">Description</Text>
            <TextInput
              placeholder="Tell us more about the event..."
              placeholderTextColor="#444"
              multiline
              numberOfLines={3}
              className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 text-white font-bold h-24"
              value={formData.description}
              onChangeText={(val) => setFormData({ ...formData, description: val })}
            />
          </View>

          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-2">Date (YYYY-MM-DD) *</Text>
              <TextInput
                placeholder="2026-04-15"
                placeholderTextColor="#444"
                className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 text-white font-bold"
                value={formData.date}
                onChangeText={(val) => setFormData({ ...formData, date: val })}
              />
            </View>
            <View className="flex-1">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-2">Max Teams *</Text>
              <TextInput
                placeholder="16"
                placeholderTextColor="#444"
                keyboardType="numeric"
                className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 text-white font-bold"
                value={formData.maxTeams}
                onChangeText={(val) => setFormData({ ...formData, maxTeams: val })}
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-white/40 text-[9px] font-black uppercase tracking-[2px] mb-2.5">Venue *</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
              className="bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="stadium-variant" size={16} color="#fbbf24" className="mr-3" />
                <Text className={`text-xs font-bold ${selectedArena ? "text-white" : "text-white/20"}`}>
                  {selectedArena ? selectedArena.name : "Select Arena"}
                </Text>
              </View>
              <MaterialIcons name="unfold-more" size={18} color="#666" />
            </TouchableOpacity>

            {/* Arena Selection Modal */}
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <View className="flex-1 justify-center items-center bg-black/90 px-6">
                <View className="bg-[#0A0A0A] rounded-[32px] w-full max-w-sm border border-white/10 overflow-hidden">
                  <View className="p-6 border-b border-white/5 flex-row justify-between items-center">
                    <Text className="text-white font-black text-sm uppercase tracking-widest">Select Venue</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                       <MaterialIcons name="close" size={18} color="#666" />
                    </TouchableOpacity>
                  </View>
                  
                  <View className="p-4 max-h-80">
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {arenas.map((arena) => (
                        <TouchableOpacity
                          key={arena.id}
                          onPress={() => {
                            setSelectedArena(arena);
                            setModalVisible(false);
                          }}
                          className={`mb-2 px-5 py-4 rounded-2xl border ${
                            selectedArena?.id === arena.id ? "bg-amber-400 border-amber-400" : "bg-white/5 border-transparent"
                          }`}
                        >
                          <View className="flex-row items-center justify-between">
                            <Text className={`font-black uppercase text-[10px] tracking-tighter ${selectedArena?.id === arena.id ? "text-black" : "text-white/70"}`}>
                              {arena.name}
                            </Text>
                            {selectedArena?.id === arena.id && (
                              <MaterialIcons name="check" size={14} color="black" />
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-2">Entry Fee (Rs.) *</Text>
              <TextInput
                placeholder="5000"
                placeholderTextColor="#444"
                keyboardType="numeric"
                className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 text-white font-bold"
                value={formData.entryFee}
                onChangeText={(val) => setFormData({ ...formData, entryFee: val })}
              />
            </View>
            <View className="flex-1">
              <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-2">Prize Pool</Text>
              <TextInput
                placeholder="Rs. 50,000"
                placeholderTextColor="#444"
                className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 text-white font-bold"
                value={formData.prizePool}
                onChangeText={(val) => setFormData({ ...formData, prizePool: val })}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleCreate}
            disabled={loading}
            className="bg-amber-400 py-5 rounded-2xl items-center justify-center mb-20 shadow-xl"
          >
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text className="text-black font-black text-sm uppercase tracking-widest">Publish Tournament</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
