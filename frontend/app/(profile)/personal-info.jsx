import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ProfileInput from '../../components/ProfileInput';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: 'Aseem Rai',
    email: 'aseem.rai@example.com',
    location: 'Kathmandu, Nepal',
    phone: '+977 9800000000',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView className="flex-1 bg-black text-white">
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
          {/* Header */}
          <View className="bg-black/90 px-4 py-4 border-b border-[#1F1F1F]">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => router.back()} className="p-2">
                <MaterialCommunityIcons name="chevron-left" size={28} color="#ffffff" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-white ml-2">Personal Information</Text>
            </View>
          </View>

          <ScrollView 
            className="flex-1 px-5 pt-8" 
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Picture Section */}
            <View className="items-center mb-10">
              <View className="relative">
                <View className="h-28 w-28 rounded-full overflow-hidden border-2 border-[#FFB300] bg-[#121212]">
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp8uv1e1BERfNA1lgYs3CMdujbEPzlE_zcAFcsMrONKO5AoXuaeVfLOQFwqQ2VYTCyGPI_747tBOMcUE03hbmjiqBYNqOHXKF4lPN6fnGxwxJfP-sYRThu0ia7uMYJQlKR6BLgbTpWF_6s5PCbSKYwcUx8T2uwUtSMRTmn9pYBM0h1Ze_l9QL_U1q4eZd_9LzWpmOawBgvGuENm7Nez2rVyo9uVrvbQT-rzDS_3Fx4yNLVNmEq67bVXWcvgXU5dR9ouZSoaSWP4rw5' }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                </View>
                <TouchableOpacity className="absolute bottom-0 right-0 bg-[#FFB300] h-9 w-9 rounded-full items-center justify-center border-2 border-black">
                  <MaterialCommunityIcons name="camera-outline" size={18} color="black" />
                </TouchableOpacity>
              </View>
              <Text className="text-[#A1A1AA] text-xs mt-3">Tap to change profile picture</Text>
            </View>

            {/* Form Fields */}
            <View>
              <ProfileInput 
                label="Full Name"
                value={formData.fullName}
                onChangeText={(text) => updateField('fullName', text)}
                icon="account-outline"
                placeholder="Enter your full name"
              />
              <ProfileInput 
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                icon="email-outline"
                keyboardType="email-address"
                placeholder="Enter your email"
              />
              <ProfileInput 
                label="Phone Number"
                value={formData.phone}
                onChangeText={(text) => updateField('phone', text)}
                icon="phone-outline"
                keyboardType="phone-pad"
                placeholder="Enter your phone number"
              />
              <ProfileInput 
                label="Location"
                value={formData.location}
                onChangeText={(text) => updateField('location', text)}
                icon="map-marker-outline"
                placeholder="Enter your location"
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              className="bg-[#FFB300] h-14 rounded-2xl items-center justify-center mt-6"
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text className="text-black font-bold text-lg uppercase tracking-wider">Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

