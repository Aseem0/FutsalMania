import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const SuccessModal = ({ 
  visible, 
  onClose, 
  title = "Success", 
  message = "Your action was completed.",
  type = "success" // options: success, info, error
}) => {
  
  useEffect(() => {
    if (visible) {
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
  }, [visible, type]);

  const getIcon = () => {
    switch (type) {
      case 'info': return 'information-variant';
      case 'error': return 'alert-circle-outline';
      case 'success':
      default: return 'check';
    }
  };

  const getThemeColor = () => {
    switch (type) {
      case 'info': return '#FFB300';
      case 'error': return '#F87171';
      case 'success':
      default: return '#fbbf24';
    }
  };

  const themeColor = getThemeColor();

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.card, { borderColor: `${themeColor}20` }]}>
          
          <View style={styles.iconRow}>
            <View style={[styles.iconCircle, { backgroundColor: themeColor }]}>
              <MaterialCommunityIcons name={getIcon()} size={24} color="#000" />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: themeColor }]} 
            onPress={onClose} 
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  iconRow: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#fbbf24',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 6,
  },
  secondaryButtonText: {
    color: '#52525b',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
});

export default SuccessModal;
