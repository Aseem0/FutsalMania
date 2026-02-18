import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ProfileInput from '../../components/ProfileInput';
import { fetchUserProfile, updateProfilePicture } from "../../services/api";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    location: 'Kathmandu, Nepal', // Static for now as per schema
    phone: '+977 9800000000',     // Static for now as per schema
    profilePicture: null
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetchUserProfile();
      const user = response.data;
      setFormData({
        username: user.username,
        email: user.email,
        location: 'Kathmandu, Nepal',
        phone: '+977 9800000000',
        profilePicture: user.profilePicture
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      handleUpdateAvatar(base64Image);
    }
  };

  const handleUpdateAvatar = async (base64Image) => {
    try {
      setUploading(true);
      await updateProfilePicture(base64Image);
      setFormData(prev => ({ ...prev, profilePicture: base64Image }));
      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      console.error("Error updating avatar:", error);
      Alert.alert("Error", "Failed to update profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="#FFB300" />
      </View>
    );
  }

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
                <TouchableOpacity activeOpacity={0.9} onPress={pickImage} className="h-28 w-28 rounded-full overflow-hidden border-2 border-[#FFB300] bg-[#121212] items-center justify-center">
                  {formData.profilePicture ? (
                    <Image 
                      source={{ uri: formData.profilePicture }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <MaterialCommunityIcons name="account" size={56} color="#333" />
                  )}
                  {uploading && (
                    <View className="absolute inset-0 bg-black/40 items-center justify-center">
                      <ActivityIndicator color="#FFB300" />
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={pickImage} className="absolute bottom-0 right-0 bg-[#FFB300] h-9 w-9 rounded-full items-center justify-center border-2 border-black">
                  <MaterialCommunityIcons name="camera-outline" size={18} color="black" />
                </TouchableOpacity>
              </View>
              <Text className="text-[#A1A1AA] text-xs mt-3">Tap to change profile picture</Text>
            </View>

            {/* Form Fields */}
            <View>
              <ProfileInput 
                label="Full Name"
                value={formData.username}
                onChangeText={(text) => updateField('username', text)}
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

