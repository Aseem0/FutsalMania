import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ProfileInput from '../../components/ProfileInput';
import ProfileOption from '../../components/ProfileOption';

export default function SupportFeedbackScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!subject || !message) {
      Alert.alert('Error', 'Please fill in both subject and message.');
      return;
    }
    
    // Simulate sending feedback
    Alert.alert(
      'Success',
      'Your feedback has been sent. Our team will get back to you soon!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
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
              <Text className="text-xl font-bold text-white ml-2">Support & Feedback</Text>
            </View>
          </View>

          <ScrollView 
            className="flex-1 px-5 pt-8" 
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-[#A1A1AA] text-sm mb-8 leading-5">
              Have a question or feedback? We'd love to hear from you. Fill out the form below or contact us directly.
            </Text>

            {/* Quick Contact Options */}
            <View className="mb-8">
              <ProfileOption 
                icon="email-outline" 
                title="Email Support" 
                subtitle="support@futsalmania.com"
                onPress={() => {}} 
              />
              <ProfileOption 
                icon="frequently-asked-questions" 
                title="FAQ" 
                subtitle="Commonly asked questions"
                onPress={() => {}} 
              />
            </View>

            {/* Feedback Form */}
            <SectionHeader title="Send us a message" />
            
            <ProfileInput 
              label="Subject"
              value={subject}
              onChangeText={setSubject}
              icon="tag-outline"
              placeholder="What is this about?"
            />

            <View className="mb-6">
              <Text className="text-[#A1A1AA] text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                Message
              </Text>
              <View className="bg-[#121212] border border-[#1F1F1F] rounded-xl px-4 py-3 min-h-[150px]">
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="How can we help you?"
                  className="text-white text-base text-top"
                  placeholderTextColor="#3F3F46"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  selectionColor="#FFB300"
                />
              </View>
            </View>

            <TouchableOpacity 
              className="bg-[#FFB300] h-14 rounded-2xl items-center justify-center mt-4"
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text className="text-black font-bold text-lg uppercase tracking-wider">Send Feedback</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const SectionHeader = ({ title }) => (
  <Text className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">
    {title}
  </Text>
);
