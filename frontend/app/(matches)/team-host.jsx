import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { hostTeamMatch, fetchMyTeams } from "../../services/api";
import { Alert } from "react-native";
import SuccessModal from "../../components/SuccessModal";

// Step Components
import ArenaStep from "../../components/host-game/ArenaStep";
import DetailsStep from "../../components/host-game/DetailsStep";
import GameSettings from "../../components/host-game/GameSettings";
import ReviewStep from "../../components/host-game/ReviewStep";

const TOTAL_STEPS = 4;

export default function TeamHostScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingTeams, setFetchingTeams] = useState(true);
  const [gameData, setGameData] = useState({
    team: null,
    customTeamName: '',
    arena: null,
    details: { date: '', time: '' },
    settings: { format: '5v5', skillLevel: 'Intermediate', matchType: 'Friendly', price: 0, contactNumber: '' },
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setFetchingTeams(true);
      const res = await fetchMyTeams();
      if (res.data && res.data.length > 0) {
        setGameData(prev => ({ ...prev, team: res.data[0], customTeamName: res.data[0].name }));
      } else {
        setGameData(prev => ({ ...prev, team: null }));
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
    } finally {
      setFetchingTeams(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final Post Logic
      try {
        setLoading(true);
        console.log("📡 POST CHALLENGE pressed, building payload...");
        
        const matchPayload = {
          teamId: gameData.team?.id || null,
          customTeamName: gameData.customTeamName || null,
          arenaId: gameData.arena?.id,
          date: gameData.details.date,
          time: gameData.details.time,
          format: gameData.settings.format,
          price: 0,
          contactNumber: gameData.settings.contactNumber,
        };

        console.log("📡 Payload:", JSON.stringify(matchPayload));
        const response = await hostTeamMatch(matchPayload);
        console.log("📡 Response status:", response.status);
        console.log("📡 Response data:", JSON.stringify(response.data));

        setShowSuccessModal(true);
      } catch (error) {
        console.error("❌ Error posting team match:", error);
        console.error("❌ Error response:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);
        const errorMessage = error.response?.data?.message || error.message || "Something went wrong while hosting the match.";
        Alert.alert("Broadcast Failed", errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const stepTitles = [
    "Select Arena",
    "Match Details",
    "Match Settings",
    "Review & Broadcast"
  ];

  const progress = (currentStep / TOTAL_STEPS) * 100;

  if (fetchingTeams) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="#fbbf24" size="large" />
        <Text className="text-white/40 mt-4 font-black uppercase tracking-widest text-[10px]">Preparing Pitch...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full border-x border-white/5">
        {/* Header */}
        <View className="px-6 pt-6 pb-2 bg-black">
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity 
              onPress={handleBack}
              className="w-10 h-10 items-center justify-center rounded-full bg-[#111] border border-white/5"
            >
              <MaterialIcons name="chevron-left" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <View className="items-center">
                <Text className="text-[10px] font-inter-bold text-amber-400 uppercase tracking-[2px]">Team Matchmaking</Text>
                <Text className="text-xl font-outfit-bold uppercase tracking-tight text-white">
                Host a Challenge
                </Text>
            </View>
            
            <TouchableOpacity className="w-10 items-center justify-center">
                <FontAwesome5 name="fist-raised" size={18} color="rgba(255,179,0,0.2)" />
            </TouchableOpacity>
          </View>


          {/* Progress Bar */}
          <View className="mb-4">
            <View className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-3">
              <View 
                className="bg-amber-400 h-full rounded-full" 
                style={{ width: `${progress}%` }} 
              />
            </View>
            <Text className="text-[11px] text-amber-400 font-inter-bold uppercase tracking-[2px] text-center">
              Step {currentStep}: {stepTitles[currentStep - 1]}
            </Text>
          </View>
        </View>

        {/* Dynamic Content */}
        <View className="flex-1">
          {currentStep === 1 && (
            <ArenaStep 
              selectedArena={gameData.arena} 
              onSelect={(arena) => setGameData({ ...gameData, arena })}
            />
          )}
          {currentStep === 2 && (
            <DetailsStep 
              arenaId={gameData.arena?.id}
              details={gameData.details}
              onUpdate={(details) => setGameData({ ...gameData, details: { ...gameData.details, ...details } })}
            />
          )}
          {currentStep === 3 && (
            <GameSettings 
              settings={gameData.settings}
              onUpdate={(settings) => setGameData({ ...gameData, settings: { ...gameData.settings, ...settings } })}
              isTeamMatch={true}
              customTeamName={gameData.customTeamName}
              onUpdateCustomTeamName={(name) => setGameData({ ...gameData, customTeamName: name })}
            />
          )}
          {currentStep === 4 && (
            <ReviewStep 
              gameData={gameData}
              onEdit={(step) => setCurrentStep(step)}
              isTeamMatch={true}
            />
          )}
        </View>

        {/* Bottom Fixed Section */}
        <View className="px-6 py-6 bg-black/80 border-t border-white/5">
          <TouchableOpacity 
            onPress={handleNext}
            disabled={
              loading ||
              (currentStep === 1 && !gameData.arena) ||
              (currentStep === 2 && (!gameData.details.date || !gameData.details.time))
            }
            className={`w-full py-4 rounded-2xl flex-row items-center justify-center gap-2 ${
              (loading || 
               (currentStep === 1 && !gameData.arena) || 
               (currentStep === 2 && (!gameData.details.date || !gameData.details.time))) 
                ? 'bg-zinc-800' : 'bg-amber-400'
            }`}
            activeOpacity={0.9}
          >
            <Text className={`font-inter-bold tracking-widest ${
              (loading || (currentStep === 1 && !gameData.arena)) ? 'text-white/20' : 'text-black'
            }`}>
              {loading ? "BROADCASTING..." : (currentStep === TOTAL_STEPS ? "POST CHALLENGE" : "NEXT STEP")}
            </Text>
            <MaterialIcons 
              name={currentStep === TOTAL_STEPS ? "send" : "arrow-forward"} 
              size={18} 
              color={(currentStep === 1 && !gameData.arena) ? "rgba(255,179,0,0.1)" : "#000"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <SuccessModal 
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.replace('/(tabs)');
        }}
        title="Challenge Live! 🏆"
        message="Your team challenge has been broadcasted. Opponents can now find you."
      />
    </SafeAreaView>
  );
}
