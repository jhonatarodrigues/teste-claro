import { ReactNode } from 'react';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { CheckSquare, FolderKanban, Plus, UsersRound } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function DrawerItem({
  label,
  onPress,
  icon,
  testID,
}: {
  label: string;
  onPress: () => void;
  icon: ReactNode;
  testID?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      className="mb-3 flex-row items-center rounded-2xl bg-app-surface px-4 py-4"
    >
      <View className="mr-3">{icon}</View>
      <Text className="text-base font-medium text-white">{label}</Text>
    </Pressable>
  );
}

export function AppDrawerContent({ navigation }: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();

  const navigateToStack = (screen: 'Teams' | 'Tasks' | 'TeamForm' | 'TaskForm') => {
    navigation.navigate('MainStack', { screen });
    navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      className="flex-1 bg-app-bg"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 32 }}
    >
      <View className="mb-8">
        <Text className="text-3xl font-bold text-white">Menu</Text>
        <Text className="mt-2 text-sm text-app-muted">Acesse as principais areas do app</Text>
      </View>

      <DrawerItem
        label="Times"
        onPress={() => navigateToStack('Teams')}
        icon={<UsersRound color="#00b37e" size={20} />}
        testID="drawer-item-teams"
      />
      <DrawerItem
        label="Todas as tarefas"
        onPress={() => navigateToStack('Tasks')}
        icon={<CheckSquare color="#00b37e" size={20} />}
        testID="drawer-item-tasks"
      />
      <DrawerItem
        label="Criar time"
        onPress={() => navigateToStack('TeamForm')}
        icon={<Plus color="#00b37e" size={20} />}
        testID="drawer-item-team-form"
      />
      <DrawerItem
        label="Nova tarefa"
        onPress={() => navigateToStack('TaskForm')}
        icon={<FolderKanban color="#00b37e" size={20} />}
        testID="drawer-item-task-form"
      />
    </DrawerContentScrollView>
  );
}
