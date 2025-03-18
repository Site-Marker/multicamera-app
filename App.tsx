import { StatusBar } from 'expo-status-bar';

import './global.css';
import { View } from 'react-native';
import { Pressable, Text } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center">
      <StatusBar style="auto" />
      <Pressable
        className="rounded-full bg-black p-4 text-white"
        onPress={() => {
          console.log('pressed');
        }}>
        <Text className="text-white">Open Camera</Text>
      </Pressable>
    </View>
  );
}
