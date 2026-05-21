import { ChevronRight, UsersRound } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Team } from '../../types/team';

type TeamCardProps = {
  team: Team;
  tasksCount?: number;
  onPress: () => void;
};

export function TeamCard({ team, tasksCount, onPress }: TeamCardProps) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center rounded-card bg-app-surface px-4 py-5">
      <UsersRound color={team.colorHex} size={20} />
      <View className="ml-4 flex-1">
        <Text className="text-base font-medium text-white">{team.name}</Text>
        {typeof tasksCount === 'number' ? (
          <Text className="mt-1 text-xs text-app-muted">{tasksCount} tarefas</Text>
        ) : null}
      </View>
      <ChevronRight color="#ffffff" size={18} />
    </Pressable>
  );
}
