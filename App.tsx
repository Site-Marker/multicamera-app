import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CameraScreen from './screens/CameraScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <CameraScreen />
    </SafeAreaProvider>
  );
}
