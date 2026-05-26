import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TaskDetailsScreen } from '../screens/TaskDetailsScreen';
import { TaskFormScreen } from '../screens/TaskFormScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { TeamFormScreen } from '../screens/TeamFormScreen';
import { TeamsScreen } from '../screens/TeamsScreen';
import { AppDrawerContent } from './AppDrawerContent';
import { RootDrawerParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#1f1f24',
    card: '#1f1f24',
    text: '#f5f5f7',
    border: '#1f1f24',
    primary: '#00b37e',
  },
};

function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Teams"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1f1f24' },
      }}
    >
      <Stack.Screen name="Teams" component={TeamsScreen} />
      <Stack.Screen name="Tasks" component={TasksScreen} />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <Stack.Screen name="TaskForm" component={TaskFormScreen} />
      <Stack.Screen name="TeamForm" component={TeamFormScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#1f1f24',
            width: 280,
          },
          sceneStyle: {
            backgroundColor: '#1f1f24',
          },
        }}
        drawerContent={(props) => <AppDrawerContent {...props} />}
      >
        <Drawer.Screen name="MainStack" component={MainStackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
