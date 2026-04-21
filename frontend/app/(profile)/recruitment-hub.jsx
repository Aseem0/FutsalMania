import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { 
  fetchMyApplications, 
  fetchReceivedApplications, 
  updateApplicationStatus,
  deleteApplication 
} from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";

export default function RecruitmentHub() {
  const router = useRouter();
  const [sentApplications, setSentApplications] = useState([]);
  const [receivedApplications, setReceivedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [success, setSuccess] = useState({ visible: false, message: "", title: "Success", type: "success" });
  const [confirm, setConfirm] = useState({ visible: false, id: null, status: null });
  const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });

  const loadData = async () => {
    try {
      setLoading(true);
      const [myRes, receivedRes] = await Promise.all([
        fetchMyApplications(),
        fetchReceivedApplications()
      ]);
      setSentApplications(myRes.data || []);
      setReceivedApplications(receivedRes.data || []);
    } catch (error) {
      console.error("Error fetching recruitment hub data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleStatusUpdate = async (id, status) => {
    setConfirm({ visible: true, id, status });
  };

  const proceedStatusUpdate = async () => {
    const { id, status } = confirm;
    try {
      setUpdating(id);
      await updateApplicationStatus(id, status);
      setConfirm({ visible: false, id: null, status: null });
      setSuccess({ 
        visible: true, 
        title: status === 'accepted' ? 'Player Accepted' : 'Player Rejected',
        message: `Player has been successfully ${status === 'accepted' ? 'accepted' : 'rejected'}.`,
        type: status === 'accepted' ? 'success' : 'info'
      });
      loadData();
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update application status.");
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteApplication = async (id) => {
    setConfirmDelete({ visible: true, id });
  };

  const proceedDeletion = async () => {
    const { id } = confirmDelete;
    try {
      setUpdating(id);
      await deleteApplication(id);
      setConfirmDelete({ visible: false, id: null });
      setSuccess({ 
        visible: true, 
        title: 'Dismissed',
        message: 'Application has been successfully removed.',
        type: 'info'
      });
      loadData();
    } catch (error) {
      console.error("Error deleting application:", error);
      Alert.alert("Error", "Failed to delete recruitment application.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 max-w-md mx-auto w-full border-x border-[#1F1F1F]">
        {/* Header */}
        <View className="bg-black/90 px-4 py-4 border-b border-[#1F1F1F]">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
              <MaterialCommunityIcons name="chevron-left" size={28} color="#ffffff" />
            </TouchableOpacity>
            <View className="ml-2">
              <Text className="text-xl font-outfit-bold text-white uppercase tracking-tight">RECRUITMENT HUB</Text>
              <Text className="text-[#A1A1AA] text-[10px] font-inter-bold uppercase tracking-widest">Manage Your Activity</Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {loading ? (
            <View className="py-20 items-center">
              <ActivityIndicator color="#FFB300" />
            </View>
          ) : (
            <View className="px-5 pt-8 pb-10">
              
              {/* Received Applications (AS HOST) */}
              <View className="mb-10">
                <View className="flex-row items-center gap-3 mb-6">
                  <View className="w-10 h-10 rounded-xl bg-amber-400/10 items-center justify-center border border-amber-400/20">
                    <MaterialCommunityIcons name="account-search-outline" size={20} color="#FFB300" />
                  </View>
                  <View>
                    <Text className="text-white font-outfit-bold text-lg leading-tight uppercase">Incoming Applications</Text>
                    <Text className="text-[#A1A1AA] text-[9px] font-inter-bold uppercase tracking-widest">Manage your recruits</Text>
                  </View>
                </View>

                {receivedApplications.length === 0 ? (
                  <View className="py-10 items-center bg-[#111] rounded-3xl border border-[#1F1F1F] border-dashed">
                    <Text className="text-white/20 font-inter-medium text-xs">No applications received yet</Text>
                  </View>
                ) : (
                  receivedApplications.map((app) => (
                    <View 
                      key={app.id} 
                      className="bg-[#121212] border border-[#1f1f1f] rounded-3xl p-5 mb-4 shadow-sm"
                    >
                      <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-row items-center">
                          <View className="w-10 h-10 rounded-full bg-[#1e1b4b] items-center justify-center mr-3 border border-white/5">
                            <Text className="text-white text-sm font-inter-black">
                              {app.applicant?.username?.substring(0, 2).toUpperCase() || "??"}
                            </Text>
                          </View>
                          <View>
                            <Text className="text-white font-inter-black text-sm">{app.applicant?.username || "Player"}</Text>
                            <Text className="text-[#A1A1AA] text-[10px] font-inter-bold uppercase tracking-widest">APPLICANT</Text>
                          </View>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <View className={`px-2 py-1 rounded-lg border ${
                            app.status === 'accepted' ? 'bg-green-500/10 border-green-500/20' :
                            app.status === 'rejected' ? 'bg-red-500/10 border-red-500/20' :
                            'bg-amber-400/10 border-amber-400/20'
                          }`}>
                            <Text className={`text-[8px] font-inter-black uppercase tracking-widest ${
                              app.status === 'accepted' ? 'text-green-500' :
                              app.status === 'rejected' ? 'text-red-500' :
                              'text-amber-400'
                            }`}>{app.status}</Text>
                          </View>
                          <TouchableOpacity 
                            onPress={() => handleDeleteApplication(app.id)}
                            className="w-7 h-7 rounded-lg bg-red-500/10 items-center justify-center border border-red-500/20"
                          >
                            <MaterialCommunityIcons name="trash-can-outline" size={14} color="#F87171" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View className="bg-black/40 p-3 rounded-2xl border border-white/5 mb-5">
                        <Text className="text-[#A1A1AA] text-[9px] font-inter-bold uppercase tracking-widest mb-1">POSITION NEEDED</Text>
                        <Text className="text-white font-inter-black text-base uppercase italic">{app.recruitment?.role}</Text>
                      </View>

                      {app.status === 'pending' ? (
                        <View className="flex-row gap-3">
                          <TouchableOpacity 
                            onPress={() => handleStatusUpdate(app.id, 'rejected')}
                            disabled={updating === app.id}
                            className="flex-1 h-12 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] items-center justify-center active:bg-red-500/10"
                          >
                            <Text className="text-[#F87171] font-inter-black text-[10px] uppercase tracking-widest">REJECT</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            onPress={() => handleStatusUpdate(app.id, 'accepted')}
                            disabled={updating === app.id}
                            className="flex-2 flex-[2] h-12 rounded-2xl bg-amber-400 items-center justify-center active:bg-amber-500"
                          >
                            {updating === app.id ? (
                              <ActivityIndicator size="small" color="black" />
                            ) : (
                              <Text className="text-black font-inter-black text-[10px] uppercase tracking-widest">ACCEPT</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className="h-12 rounded-2xl bg-[#1a1a1a] border border-white/5 items-center justify-center">
                          <Text className="text-[#A1A1AA] font-inter-bold text-[10px] uppercase tracking-widest">
                            {app.status === 'accepted' ? 'PLAYER ACCEPTED' : 'PLAYER REJECTED'}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>

              {/* Sent Applications (AS APPLICANT) */}
              <View>
                <View className="flex-row items-center gap-3 mb-6">
                  <View className="w-10 h-10 rounded-xl bg-blue-400/10 items-center justify-center border border-blue-400/20">
                    <MaterialCommunityIcons name="send-outline" size={20} color="#60A5FA" />
                  </View>
                  <View>
                    <Text className="text-white font-outfit-bold text-lg leading-tight uppercase">Applications Sent</Text>
                    <Text className="text-[#A1A1AA] text-[9px] font-inter-bold uppercase tracking-widest">Track your status</Text>
                  </View>
                </View>

                {sentApplications.length === 0 ? (
                  <View className="py-10 items-center bg-[#111] rounded-3xl border border-[#1F1F1F] border-dashed">
                    <Text className="text-white/20 font-inter-medium text-xs">You haven't applied to any games yet</Text>
                  </View>
                ) : (
                  sentApplications.map((app) => (
                    <View key={app.id} className="bg-[#121212] border border-[#1f1f1f] rounded-3xl p-5 mb-4 shadow-sm">
                      <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1">
                          <Text className="text-[#A1A1AA] text-[9px] font-inter-bold uppercase tracking-widest mb-1">TEAM / HOST</Text>
                          <Text className="text-white font-inter-black text-sm uppercase italic">
                            {app.recruitment?.host?.username || "Player"}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <View className={`px-2 py-1 rounded-lg border ${
                            app.status === 'accepted' ? 'bg-green-500/10 border-green-500/20' :
                            app.status === 'rejected' ? 'bg-red-500/10 border-red-500/20' :
                            'bg-amber-400/10 border-amber-400/20'
                          }`}>
                            <Text className={`text-[8px] font-inter-black uppercase tracking-widest ${
                              app.status === 'accepted' ? 'text-green-500' :
                              app.status === 'rejected' ? 'text-red-500' :
                              'text-amber-400'
                            }`}>{app.status}</Text>
                          </View>
                          <TouchableOpacity 
                            onPress={() => handleDeleteApplication(app.id)}
                            className="w-7 h-7 rounded-lg bg-red-500/10 items-center justify-center border border-red-500/20"
                          >
                            <MaterialCommunityIcons name="trash-can-outline" size={14} color="#F87171" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View className="bg-black/40 p-3 rounded-2xl border border-white/5 mb-3">
                        <Text className="text-[#A1A1AA] text-[9px] font-inter-bold uppercase tracking-widest mb-1">ROLE APPLIED FOR</Text>
                        <Text className="text-white font-inter-black text-base uppercase italic">{app.recruitment?.role}</Text>
                      </View>
                      
                      <View className="bg-amber-400/5 p-3 rounded-2xl border border-amber-400/10 flex-row items-center">
                        <View className="w-8 h-8 rounded-full bg-amber-400/10 items-center justify-center mr-3">
                          <MaterialCommunityIcons name="phone" size={14} color="#FFB300" />
                        </View>
                        <View>
                          <Text className="text-[#A1A1AA] text-[8px] font-inter-bold uppercase tracking-widest">CONTACT HOST</Text>
                          <Text className="text-white font-inter-black text-xs">{app.recruitment?.contactNumber || "Not Provided"}</Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>

            </View>
          )}
        </ScrollView>
      </View>

      <ConfirmModal
        visible={confirmDelete.visible}
        title="Dismiss Application?"
        message="This will remove the application from your list permanently. This action cannot be undone."
        confirmText="DELETE"
        confirmDestructive={true}
        onCancel={() => setConfirmDelete({ visible: false, id: null })}
        onConfirm={proceedDeletion}
        loading={updating === confirmDelete.id}
      />

      <ConfirmModal
        visible={confirm.visible}
        title={confirm.status === 'accepted' ? "Accept Player?" : "Reject Applicant?"}
        message={confirm.status === 'accepted' 
          ? "This player will be notified that they've been chosen for your recruitment post." 
          : "Are you sure you want to reject this player's application?"}
        confirmText={confirm.status === 'accepted' ? "ACCEPT" : "REJECT"}
        confirmDestructive={confirm.status === 'rejected'}
        onCancel={() => setConfirm({ visible: false, id: null, status: null })}
        onConfirm={proceedStatusUpdate}
        loading={updating === confirm.id}
      />

      <SuccessModal
        visible={success.visible}
        title={success.title}
        message={success.message}
        type={success.type}
        onClose={() => setSuccess({ ...success, visible: false })}
      />
    </SafeAreaView>
  );
}
