import 'react-native-gesture-handler';
import './global.css';

import { StatusBar } from 'expo-status-bar';

import { AppNavigator } from './src/navigation';
import { AppProviders } from './src/providers/AppProviders';

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="light" />
      <AppNavigator />
    </AppProviders>
  );
}
