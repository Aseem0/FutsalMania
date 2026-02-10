import { Slot } from 'expo-router';
import { View } from 'react-native';
import BottomNav from '../../components/BottomNav';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Slot />
      <BottomNav />
    </View>
  );
}
