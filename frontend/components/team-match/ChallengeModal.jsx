import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { fetchMyTeams } from '../../services/api';

const ChallengeModal = ({ visible, onClose, onConfirm, loading, targetTeamName }) => {
  const [teamName, setTeamName] = useState('');
  const [contact, setContact] = useState('');
  const [myTeams, setMyTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [loadingTeams, setLoadingTeams] = useState(false);

  useEffect(() => {
    if (visible) {
      loadTeams();
    }
  }, [visible]);

  const loadTeams = async () => {
    try {
      setLoadingTeams(true);
      const res = await fetchMyTeams();
      setMyTeams(res.data || []);
      if (res.data && res.data.length > 0) {
        const firstTeam = res.data[0];
        setSelectedTeamId(firstTeam.id);
        setTeamName(firstTeam.name);
      }
    } catch (error) {
      console.error("Error loading my teams:", error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleSelectTeam = (team) => {
    setSelectedTeamId(team.id);
    setTeamName(team.name);
  };

  const clearFormalTeam = () => {
    setSelectedTeamId(null);
    setTeamName('');
  };

  const handleConfirm = () => {
    if (!contact) {
      alert("Contact number is required.");
      return;
    }
    if (!teamName) {
      alert("Team name is required.");
      return;
    }
    onConfirm({
      teamId: selectedTeamId,
      customTeamName: selectedTeamId ? null : teamName,
      contactNumber: contact,
    });
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <FontAwesome5 name="fist-raised" size={20} color="#000" />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.title}>Send Match Challenge</Text>
                  <Text style={styles.subtitle}>Challenging: {targetTeamName}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <MaterialCommunityIcons name="close" size={24} color="#71717a" />
                </TouchableOpacity>
              </View>

              {/* Form Content */}
              <View style={styles.form}>
                
                {/* Team Selection */}
                <Text style={styles.label}>WHICH TEAM ARE YOU REPRESENTING?</Text>
                
                {loadingTeams ? (
                  <ActivityIndicator color="#fbbf24" style={{ marginVertical: 10 }} />
                ) : myTeams.length > 0 ? (
                  <View style={styles.teamList}>
                    {myTeams.map((team) => (
                      <TouchableOpacity
                        key={team.id}
                        onPress={() => handleSelectTeam(team)}
                        style={[
                          styles.teamItem,
                          selectedTeamId === team.id && styles.teamItemSelected
                        ]}
                      >
                        <MaterialCommunityIcons 
                          name={selectedTeamId === team.id ? "shield-check" : "shield-outline"} 
                          size={18} 
                          color={selectedTeamId === team.id ? "#000" : "#71717a"} 
                        />
                        <Text style={[
                          styles.teamItemText,
                          selectedTeamId === team.id && styles.teamItemTextSelected
                        ]}>
                          {team.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      onPress={clearFormalTeam}
                      style={[
                        styles.teamItem,
                        !selectedTeamId && styles.teamItemSelected
                      ]}
                    >
                      <MaterialCommunityIcons 
                        name="pencil-outline" 
                        size={18} 
                        color={!selectedTeamId ? "#000" : "#71717a"} 
                      />
                      <Text style={[
                        styles.teamItemText,
                        !selectedTeamId && styles.teamItemTextSelected
                      ]}>
                        Other / Custom Name
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* Team Name Input */}
                {!selectedTeamId && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>TEAM NAME</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your team name"
                      placeholderTextColor="#3f3f46"
                      value={teamName}
                      onChangeText={setTeamName}
                    />
                  </View>
                )}

                {/* Contact Input */}
                <View style={[styles.inputContainer, { marginTop: 15 }]}>
                  <Text style={styles.inputLabel}>YOUR CONTACT NUMBER (REQUIRED)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 9841XXXXXX"
                    placeholderTextColor="#3f3f46"
                    keyboardType="phone-pad"
                    value={contact}
                    onChangeText={setContact}
                  />
                </View>
              </View>

              {/* Action */}
              <TouchableOpacity
                style={[styles.confirmBtn, loading && styles.disabledBtn]}
                onPress={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <>
                    <Text style={styles.confirmBtnText}>SEND CHALLENGE</Text>
                    <MaterialCommunityIcons name="arrow-right" size={18} color="black" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: '#000',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#1f1f1f',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
  },
  subtitle: {
    color: '#71717a',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  form: {
    marginBottom: 30,
  },
  label: {
    color: '#fbbf24',
    fontSize: 10,
    fontFamily: 'Inter-Black',
    letterSpacing: 2,
    marginBottom: 12,
  },
  teamList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  teamItemSelected: {
    backgroundColor: '#fbbf24',
    borderColor: '#fbbf24',
  },
  teamItemText: {
    color: '#71717a',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  teamItemTextSelected: {
    color: '#000',
  },
  inputContainer: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  inputLabel: {
    color: '#52525b',
    fontSize: 9,
    fontFamily: 'Inter-Black',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  input: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    padding: 0,
  },
  confirmBtn: {
    backgroundColor: '#fbbf24',
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  confirmBtnText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Inter-Black',
    letterSpacing: 1.5,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});

export default ChallengeModal;
