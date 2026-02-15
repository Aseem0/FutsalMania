import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter} from 'expo-router';

export default function HostGameScreen() {
  const router = useRouter();
  
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-black">
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity 
              onPress={handleBack}
              className="w-10 h-10 items-center justify-center rounded-full bg-[#1a1a1a] border border-[#333333]"
            >
              <MaterialIcons name="chevron-left" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <Text className="text-xl font-bold uppercase tracking-tight text-white">
              Host a Game
            </Text>
            
            <View className="w-10" />
          </View>

          {/* Simple Progress Bar */}
          <View className="max-w-xs mx-auto mb-2">
            <View className="flex-row gap-1.5 mb-2">
              <View className="flex-1 h-1.5 rounded-full bg-[#f4ab25]" />
              <View className="flex-1 h-1.5 rounded-full bg-zinc-800" />
              <View className="flex-1 h-1.5 rounded-full bg-zinc-800" />
              <View className="flex-1 h-1.5 rounded-full bg-zinc-800" />
            </View>
            <Text className="text-[10px] text-[#f4ab25] font-bold uppercase tracking-[0.15em] text-center">
              Step 1: Select Arena
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView className="flex-1 px-6 pb-40" showsVerticalScrollIndicator={false}>
          <View className="mt-4">
            <Text className="text-2xl font-bold mb-2 text-white">Select Arena</Text>
            <Text className="text-zinc-400 text-sm mb-6">
              Choose a premium court from our curated list.
            </Text>
          </View>

          {/* Search Bar */}
          <View className="relative mb-6">
            <MaterialIcons 
              name="search" 
              size={20} 
              color="#71717a" 
              style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }}
            />
            <TextInput
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white"
              placeholder="Search 30+ arenas..."
              placeholderTextColor="#71717a"
              style={{ outlineStyle: 'none' }}
            />
          </View>

          {/* Arena List */}
          <View className="gap-4">
            {/* Selected Arena */}
            <View className="bg-[#1a1a1a] p-3 rounded-xl border-2 border-[#f4ab25] flex-row gap-4 items-center">
              <View className="w-20 h-20 rounded-xl overflow-hidden">
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5s5OVWvPW6i7rcLaonc8OtGaKaoMNNbdPzoClC2L3Taa2_rPfLin9hfADNaGr8L8KElQ39WL1oV_cpASqSeE2BqAopIyUSKJ46hrpM0OpuXIGZLQ4q2eDuSI9X91go7ZCJ_sSN4UcnXcjduKILuSD9dwOGjy6CPF96XcPcRBJ2_MrykmdjVEJmIgKZyHUsP0rklE6wImRcaCaUKbmyHFeY9rFhWU2neavQEG5AgrI9Ql307xWP7hypgED7RHq5nCwPywlm_dIyjAI' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <Text className="font-bold text-white">Downtown Futsal Center</Text>
                  <View className="flex-row items-center">
                    <MaterialIcons name="star" size={12} color="#f4ab25" />
                    <Text className="text-xs ml-1 font-bold text-[#f4ab25]">4.8</Text>
                  </View>
                </View>

                <View className="flex-row items-center mt-1">
                  <MaterialIcons name="place" size={12} color="#a1a1aa" />
                  <Text className="text-zinc-400 text-xs ml-1">12th Avenue, Midtown</Text>
                </View>

                <View className="mt-2 bg-[#f4ab25]/10 px-2 py-0.5 rounded self-start">
                  <Text className="text-[#f4ab25] text-[10px] font-bold uppercase tracking-wider">
                    0.8 km away
                  </Text>
                </View>
              </View>

              <View className="absolute top-2 right-2 bg-[#f4ab25] rounded-full w-5 h-5 items-center justify-center">
                <MaterialIcons name="check" size={14} color="#000000" />
              </View>
            </View>

            {/* Arena 2 */}
            <TouchableOpacity className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5 flex-row gap-4 items-center">
              <View className="w-20 h-20 rounded-xl overflow-hidden opacity-80">
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwkxgsj2STX7v7Sn13RcY-H18cRCn566Xkbe1_NlhL-8BNYg-Manir-ScfX7cskWNgwiRx9SICOsSAkRKS1XyrzkDNy55wpmpju2j2CKhxNl-3Ugtdg_nHALAV1IJK-jKn7q9LgRYxzqKJc1Qs0gxMc2etpctt6_Zz6MZxsyT1jECZmbD03LsF3P810FT65X0GCzIUsX34JoP3QO-LzHhY4jRp2FbRCf5j1J9JbcyJKgV-zp6oMSCUFq-yyGnfHp9dQU6C7PfsTlJM' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <Text className="font-bold text-white">Elite Sports Arena</Text>
                  <View className="flex-row items-center">
                    <MaterialIcons name="star" size={12} color="#f4ab25" />
                    <Text className="text-xs ml-1 font-bold text-[#f4ab25]">4.5</Text>
                  </View>
                </View>

                <View className="flex-row items-center mt-1">
                  <MaterialIcons name="place" size={12} color="#a1a1aa" />
                  <Text className="text-zinc-400 text-xs ml-1">Oak Ridge Business Park</Text>
                </View>

                <Text className="mt-2 text-[#f4ab25] text-[10px] font-bold uppercase tracking-wider">
                  2.4 km away
                </Text>
              </View>
            </TouchableOpacity>

            {/* Arena 3 */}
            <TouchableOpacity className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5 flex-row gap-4 items-center">
              <View className="w-20 h-20 rounded-xl overflow-hidden opacity-80">
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuQv2NugZlsuE363SH5lAYknHJSe0mzyGA4eSHkHQIm4V5BF2sT8qgc9uWUTZj9HebtYmNBqMG7RbkzTp4-wiYLbKvxALLA_d_eOADQ-HKkVgi2ej6ueEDNC0-GziBYOzqrswGKkPvvXcaVWHxj5rxG-SPFezZrKGV43sfFt-9S5dwRJUuI9XyNnlFSmn6RALnpGWda1-3ieX5LKy79ZKhCwsOnsF6ciCHzKNqL58HnZZZxCM1tJkXWmjicC1uo27w8ZyZgeF2tFqJ' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <Text className="font-bold text-white">The Cage Stadium</Text>
                  <View className="flex-row items-center">
                    <MaterialIcons name="star" size={12} color="#f4ab25" />
                    <Text className="text-xs ml-1 font-bold text-[#f4ab25]">4.2</Text>
                  </View>
                </View>

                <View className="flex-row items-center mt-1">
                  <MaterialIcons name="place" size={12} color="#a1a1aa" />
                  <Text className="text-zinc-400 text-xs ml-1">Sunset Boulevard, East Side</Text>
                </View>

                <Text className="mt-2 text-[#f4ab25] text-[10px] font-bold uppercase tracking-wider">
                  3.1 km away
                </Text>
              </View>
            </TouchableOpacity>

            {/* Arena 4 */}
            <TouchableOpacity className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5 flex-row gap-4 items-center">
              <View className="w-20 h-20 rounded-xl overflow-hidden opacity-80">
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCypEv0RLqtSi_QOv_SvRCCbsEp61NzqbQaiSQrcRVEHWwaKzooufWjn5B45PF-Nw97b0PSrUttoEi5fFd9pnTlI8mgJWaxKk8HGZyztLywEIBomzdZLvTUEyhPePIefxG76ErwK6-Ckd8HNXorId51ujBJN5qlL5iS0cqocyW7vGkZIYjCoinezTeDa7wss_KbfIRQ-zKkTIhf3gZnpjO-_pyx4CkX-iqG3TJizUGEXch_uADI_wBFeaYXyX9echht4r6mLFNXHFkX' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <Text className="font-bold text-white">Urban Kick Zone</Text>
                  <View className="flex-row items-center">
                    <MaterialIcons name="star" size={12} color="#f4ab25" />
                    <Text className="text-xs ml-1 font-bold text-[#f4ab25]">4.7</Text>
                  </View>
                </View>

                <View className="flex-row items-center mt-1">
                  <MaterialIcons name="place" size={12} color="#a1a1aa" />
                  <Text className="text-zinc-400 text-xs ml-1">Industrial District</Text>
                </View>

                <Text className="mt-2 text-[#f4ab25] text-[10px] font-bold uppercase tracking-wider">
                  5.0 km away
                </Text>
              </View>
            </TouchableOpacity>

            <View className="py-4">
              <Text className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold text-center">
                Showing 4 of 32 venues
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Fixed Section */}
        <View className="absolute bottom-0 left-0 right-0 bg-black/80 border-t border-white/5">
          {/* Next Button */}
          <View className="px-6 py-4">
            <TouchableOpacity 
              className="w-full bg-[#f4ab25] py-4 rounded-xl flex-row items-center justify-center gap-2"
              activeOpacity={0.98}
              style={{
                shadowColor: '#f4ab25',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 8,
              }}
            >
              <Text className="text-black font-bold">NEXT</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#000000" />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}
