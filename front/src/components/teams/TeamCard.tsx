import { ChevronRight, Pencil, Trash2, UsersRound } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Team } from '../../types/team';

type TeamCardProps = {
  team: Team;
  tasksCount?: number;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TeamCard({ team, tasksCount, onPress, onEdit, onDelete }: TeamCardProps) {
  return (
    <View className="flex-row items-center rounded-card bg-app-surface px-4 py-5">
      <Pressable testID="team-card-pressable" onPress={onPress} className="flex-1 flex-row items-center">
        <UsersRound color={team.colorHex} size={20} />
        <View className="ml-4 flex-1">
          <Text className="text-base font-medium text-white">{team.name}</Text>
          {typeof tasksCount === 'number' ? (
            <Text className="mt-1 text-xs text-app-muted">{tasksCount} tarefas</Text>
          ) : null}
        </View>
        <ChevronRight color="#ffffff" size={18} />
      </Pressable>

      <View className="ml-2 flex-row items-center">
        <Pressable
          testID="team-card-edit-action"
          onPress={onEdit}
          className="h-10 w-10 items-center justify-center"
        >
          <Pencil color="#ffffff" size={16} />
        </Pressable>
        <Pressable
          testID="team-card-delete-action"
          onPress={onDelete}
          className="h-10 w-10 items-center justify-center"
        >
          <Trash2 color="#ffffff" size={16} />
        </Pressable>
      </View>
    </View>
  );
}
