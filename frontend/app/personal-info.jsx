import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: 'Aseem Rai',
    email: 'aseem.rai@example.com',
    location: 'Kathmandu, Nepal',
    phone: '+977 9800000000',
  });

  const InputField = ({ label, value, onChangeText, icon, keyboardType = 'default' }) => (
    <View className="mb-6">
      <Text className="text-[#A1A1AA] text-xs font-bold uppercase tracking-widest mb-2 ml-1">
        {label}
      </Text>
      <View className="flex-row items-center bg-[#121212] border border-[#1F1F1F] rounded-xl px-4 h-14">
        <View style={{ marginRight: 12 }}>
          <MaterialCommunityIcons name={icon} size={20} color="#FFB300" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="flex-1 text-white text-base"
          placeholderTextColor="#3F3F46"
          keyboardType={keyboardType}
          style={{ marginLeft: 4 }}
        />
      </View>
    </View>
  );

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
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => router.back()} className="p-2">
                <MaterialCommunityIcons name="chevron-left" size={28} color="#ffffff" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-white">Personal Information</Text>
              <View className="w-10" />
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
              <InputField 
                label="Full Name"
                value={formData.fullName}
                onChangeText={(text) => setFormData({...formData, fullName: text})}
                icon="account-outline"
              />
              <InputField 
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                icon="email-outline"
                keyboardType="email-address"
              />
              <InputField 
                label="Phone Number"
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                icon="phone-outline"
                keyboardType="phone-pad"
              />
              <InputField 
                label="Location"
                value={formData.location}
                onChangeText={(text) => setFormData({...formData, location: text})}
                icon="map-marker-outline"
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              className="bg-[#FFB300] h-14 rounded-2xl items-center justify-center mt-6"
              onPress={() => router.back()}
            >
              <Text className="text-black font-bold text-lg uppercase tracking-wider">Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
