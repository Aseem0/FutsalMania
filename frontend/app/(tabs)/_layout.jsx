import { Tabs, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: { display: 'none' },
      tabBarActiveTintColor: '#34d399' 
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.replace('/login')}
              style={{ marginRight: 15 }}
            >
              <MaterialCommunityIcons name="login" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
