import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ConfirmModal = ({
  visible,
  onCancel,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  confirmDestructive = false,
  loading = false,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.card}>

          <View style={styles.iconRow}>
            <View style={[styles.iconCircle, confirmDestructive && styles.iconCircleRed]}>
              <MaterialCommunityIcons
                name={confirmDestructive ? "alert" : "help"}
                size={22}
                color="#fff"
              />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, confirmDestructive && styles.confirmButtonRed]}
              onPress={onConfirm}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>{loading ? "..." : confirmText}</Text>
            </TouchableOpacity>
          </View>

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
    backgroundColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleRed: {
    backgroundColor: '#450a0a',
  },
  title: {
    fontSize: 17,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cancelText: {
    color: '#71717a',
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fbbf24',
  },
  confirmButtonRed: {
    backgroundColor: '#dc2626',
  },
  confirmText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
});

export default ConfirmModal;
