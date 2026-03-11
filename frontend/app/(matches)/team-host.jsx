import React, { useState } from "react";
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { hostTeamMatch } from "../../services/api";
import { Alert } from "react-native";

// Step Components
import TeamStep from "../../components/host-game/TeamStep";
import ArenaStep from "../../components/host-game/ArenaStep";
import DetailsStep from "../../components/host-game/DetailsStep";
import ReviewStep from "../../components/host-game/ReviewStep";

const TOTAL_STEPS = 4;

export default function TeamHostScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gameData, setGameData] = useState({
    team: null,
    arena: null,
    details: { date: '', time: '' },
    settings: { format: '5v5', price: 0 },
  });

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
        const matchPayload = {
          teamId: gameData.team.id,
          arenaId: gameData.arena.id,
          date: gameData.details.date,
          time: gameData.details.time,
          format: gameData.settings.format,
          price: gameData.settings.price,
        };

        const response = await hostTeamMatch(matchPayload);
        
        if (response.status === 201 || response.status === 200) {
          Alert.alert("Victory!", "Your team match has been broadcasted. Waiting for challengers!");
          router.replace('/(tabs)/teams');
        }
      } catch (error) {
        console.error("Error posting team match:", error);
        const errorMessage = error.response?.data?.message || "Something went wrong while hosting the match.";
        Alert.alert("Broadcast Failed", errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const stepTitles = [
    "Select Your Team",
    "Choose Arena",
    "Match Details",
    "Review & Broadcast"
  ];

  const progress = (currentStep / TOTAL_STEPS) * 100;

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
                <Text className="text-[10px] font-black text-amber-400 uppercase tracking-[2px]">Team Matchmaking</Text>
                <Text className="text-xl font-black uppercase tracking-tight text-white">
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
            <Text className="text-[11px] text-amber-400 font-black uppercase tracking-[2px] text-center">
              Step {currentStep}: {stepTitles[currentStep - 1]}
            </Text>
          </View>
        </View>

        {/* Dynamic Content */}
        <View className="flex-1">
          {currentStep === 1 && (
            <TeamStep 
              selectedTeam={gameData.team} 
              onSelect={(team) => setGameData({ ...gameData, team })} 
            />
          )}
          {currentStep === 2 && (
            <ArenaStep 
              selectedArena={gameData.arena} 
              onSelect={(arena) => setGameData({ ...gameData, arena })} 
            />
          )}
          {currentStep === 3 && (
            <DetailsStep 
              details={gameData.details}
              onUpdate={(details) => setGameData({ ...gameData, details: { ...gameData.details, ...details } })}
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
              (currentStep === 1 && !gameData.team) ||
              (currentStep === 2 && !gameData.arena) ||
              (currentStep === 3 && (!gameData.details.date || !gameData.details.time))
            }
            className={`w-full py-4 rounded-2xl flex-row items-center justify-center gap-2 ${
              (loading || 
               (currentStep === 1 && !gameData.team) || 
               (currentStep === 2 && !gameData.arena) || 
               (currentStep === 3 && (!gameData.details.date || !gameData.details.time))) 
                ? 'bg-zinc-800' : 'bg-amber-400'
            }`}
            activeOpacity={0.9}
          >
            <Text className={`font-black tracking-widest ${
              (loading || (currentStep === 1 && !gameData.team)) ? 'text-white/20' : 'text-black'
            }`}>
              {loading ? "BROADCASTING..." : (currentStep === TOTAL_STEPS ? "POST CHALLENGE" : "NEXT STEP")}
            </Text>
            <MaterialIcons 
              name={currentStep === TOTAL_STEPS ? "send" : "arrow-forward"} 
              size={18} 
              color={(currentStep === 1 && !gameData.team) ? "rgba(255,255,255,0.1)" : "#000"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
