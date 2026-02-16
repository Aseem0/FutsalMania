import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ARENAS = [
  {
    id: 1,
    name: "Downtown Futsal Center",
    rating: 4.8,
    location: "12th Avenue, Midtown",
    distance: "0.8 km away",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5s5OVWvPW6i7rcLaonc8OtGaKaoMNNbdPzoClC2L3Taa2_rPfLin9hfADNaGr8L8KElQ39WL1oV_cpASqSeE2BqAopIyUSKJ46hrpM0OpuXIGZLQ4q2eDuSI9X91go7ZCJ_sSN4UcnXcjduKILuSD9dwOGjy6CPF96XcPcRBJ2_MrykmdjVEJmIgKZyHUsP0rklE6wImRcaCaUKbmyHFeY9rFhWU2neavQEG5AgrI9Ql307xWP7hypgED7RHq5nCwPywlm_dIyjAI'
  },
  {
    id: 2,
    name: "Elite Sports Arena",
    rating: 4.5,
    location: "Oak Ridge Business Park",
    distance: "2.4 km away",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwkxgsj2STX7v7Sn13RcY-H18cRCn566Xkbe1_NlhL-8BNYg-Manir-ScfX7cskWNgwiRx9SICOsSAkRKS1XyrzkDNy55wpmpju2j2CKhxNl-3Ugtdg_nHALAV1IJK-jKn7q9LgRYxzqKJc1Qs0gxMc2etpctt6_Zz6MZxsyT1jECZmbD03LsF3P810FT65X0GCzIUsX34JoP3QO-LzHhY4jRp2FbRCf5j1J9JbcyJKgV-zp6oMSCUFq-yyGnfHp9dQU6C7PfsTlJM'
  },
  {
    id: 3,
    name: "The Cage Stadium",
    rating: 4.2,
    location: "Sunset Boulevard, East Side",
    distance: "3.1 km away",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuQv2NugZlsuE363SH5lAYknHJSe0mzyGA4eSHkHQIm4V5BF2sT8qgc9uWUTZj9HebtYmNBqMG7RbkzTp4-wiYLbKvxALLA_d_eOADQ-HKkVgi2ej6ueEDNC0-GziBYOzqrswGKkPvvXcaVWHxj5rxG-SPFezZrKGV43sfFt-9S5dwRJUuI9XyNnlFSmn6RALnpGWda1-3ieX5LKy79ZKhCwsOnsF6ciCHzKNqL58HnZZZxCM1tJkXWmjicC1uo27w8ZyZgeF2tFqJ'
  },
  {
    id: 4,
    name: "Urban Kick Zone",
    rating: 4.7,
    location: "Industrial District",
    distance: "5.0 km away",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCypEv0RLqtSi_QOv_SvRCCbsEp61NzqbQaiSQrcRVEHWwaKzooufWjn5B45PF-Nw97b0PSrUttoEi5fFd9pnTlI8mgJWaxKk8HGZyztLywEIBomzdZLvTUEyhPePIefxG76ErwK6-Ckd8HNXorId51ujBJN5qlL5iS0cqocyW7vGkZIYjCoinezTeDa7wss_KbfIRQ-zKkTIhf3gZnpjO-_pyx4CkX-iqG3TJizUGEXch_uADI_wBFeaYXyX9echht4r6mLFNXHFkX'
  }
];

export default function ArenaStep({ selectedArena, onSelect }) {
  return (
    <ScrollView className="flex-1 px-6 pb-20" showsVerticalScrollIndicator={false}>
      <View className="mt-4">
        <Text className="text-2xl font-black mb-2 text-white">Select Arena</Text>
        <Text className="text-white/50 text-sm mb-8 font-medium">
          Choose a premium court from our curated list.
        </Text>
      </View>

      {/* Search Bar */}
      <View className="relative mb-8">
        <MaterialIcons 
          name="search" 
          size={20} 
          color="rgba(255,255,255,0.3)" 
          style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }}
        />
        <TextInput
          className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white"
          placeholder="Search 30+ arenas..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          style={{ outlineStyle: 'none' }}
        />
      </View>

      {/* Arena List */}
      <View className="gap-4">
        {ARENAS.map((arena) => (
          <TouchableOpacity 
            key={arena.id}
            onPress={() => onSelect(arena)}
            className={`p-3 rounded-2xl flex-row gap-4 items-center border ${
              selectedArena?.id === arena.id 
                ? "bg-amber-400/5 border-amber-400" 
                : "bg-[#111] border-white/5"
            }`}
          >
            <View className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-900">
              <Image
                source={{ uri: arena.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className="flex-1">
              <View className="flex-row justify-between items-start">
                <Text className="font-bold text-white text-md">{arena.name}</Text>
                <View className="flex-row items-center">
                  <MaterialIcons name="star" size={12} color="#fbbf24" />
                  <Text className="text-xs ml-1 font-black text-amber-400">{arena.rating}</Text>
                </View>
              </View>

              <View className="flex-row items-center mt-1">
                <MaterialIcons name="place" size={12} color="rgba(255,255,255,0.4)" />
                <Text className="text-white/40 text-xs ml-1 font-medium">{arena.location}</Text>
              </View>

              <View className="mt-2 bg-amber-400/10 px-2 py-0.5 rounded-full self-start">
                <Text className="text-amber-400 text-[10px] font-black uppercase tracking-wider">
                  {arena.distance}
                </Text>
              </View>
            </View>

            {selectedArena?.id === arena.id && (
              <View className="absolute top-2 right-2 bg-amber-400 rounded-full w-5 h-5 items-center justify-center">
                <MaterialIcons name="check" size={14} color="#000000" />
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View className="py-8">
          <Text className="text-white/20 text-[10px] uppercase tracking-[3px] font-black text-center">
            Showing {ARENAS.length} of 32 venues
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
