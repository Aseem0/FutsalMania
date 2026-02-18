import React, { useState } from "react";
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Step Components
import ArenaStep from "../../components/host-game/ArenaStep";
import DetailsStep from "../../components/host-game/DetailsStep";
import GameSettings from "../../components/host-game/GameSettings";
import ReviewStep from "../../components/host-game/ReviewStep";

const TOTAL_STEPS = 4;

export default function HostGameScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [gameData, setGameData] = useState({
    arena: null,
    details: { name: '', date: '', time: '' },
    settings: { skillLevel: 'Intermediate', format: '5v5', maxPlayers: 10, price: 0 },
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

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final Post Logic
      console.log("Posting Game:", gameData);
      router.replace('/(tabs)');
    }
  };

  const stepTitles = [
    "Select Arena",
    "Game Details",
    "Game Settings",
    "Review & Post"
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
            
            <Text className="text-xl font-black uppercase tracking-tight text-white">
              Host a Game
            </Text>
            
            <View className="w-10" />
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
            <ArenaStep 
              selectedArena={gameData.arena} 
              onSelect={(arena) => setGameData({ ...gameData, arena })} 
            />
          )}
          {currentStep === 2 && (
            <DetailsStep 
              details={gameData.details}
              onUpdate={(details) => setGameData({ ...gameData, details: { ...gameData.details, ...details } })}
            />
          )}
          {currentStep === 3 && (
            <GameSettings 
              settings={gameData.settings}
              onUpdate={(settings) => setGameData({ ...gameData, settings: { ...gameData.settings, ...settings } })}
            />
          )}
          {currentStep === 4 && (
            <ReviewStep 
              gameData={gameData}
              onEdit={(step) => setCurrentStep(step)}
            />
          )}
        </View>

        {/* Bottom Fixed Section */}
        <View className="px-6 py-6 bg-black/80 border-t border-white/5">
          <TouchableOpacity 
            onPress={handleNext}
            disabled={
              (currentStep === 1 && !gameData.arena) ||
              (currentStep === 2 && (!gameData.details.date || !gameData.details.time))
            }
            className={`w-full py-4 rounded-2xl flex-row items-center justify-center gap-2 ${
              ((currentStep === 1 && !gameData.arena) || (currentStep === 2 && (!gameData.details.date || !gameData.details.time))) 
                ? 'bg-zinc-800' : 'bg-amber-400'
            }`}
            activeOpacity={0.9}
          >
            <Text className={`font-black tracking-widest ${
              currentStep === 1 && !gameData.arena ? 'text-white/20' : 'text-black'
            }`}>
              {currentStep === TOTAL_STEPS ? "POST GAME" : "NEXT STEP"}
            </Text>
            <MaterialIcons 
              name={currentStep === TOTAL_STEPS ? "check" : "arrow-forward"} 
              size={18} 
              color={currentStep === 1 && !gameData.arena ? "rgba(255,255,255,0.1)" : "#000"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
