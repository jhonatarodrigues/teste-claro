import { Pressable, Text, View } from 'react-native';

import { Team } from '../../types/team';
import { Task } from '../../types/task';
import { formatDueDateLabel } from '../../utils/due-date';
import { StatusBadge } from '../ui/StatusBadge';
import { TeamChip } from '../ui/TeamChip';

type TaskCardProps = {
  task: Task;
  teams: Team[];
  onPress: () => void;
};

export function TaskCard({ task, teams, onPress }: TaskCardProps) {
  const relatedTeams = teams.filter((team) => task.teamIds.includes(team.id));
  const dueDateLabel = formatDueDateLabel(task.dueDate);

  return (
    <Pressable onPress={onPress} className="rounded-card bg-app-surface px-4 py-4">
      <View className="mb-2 flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white">{task.title}</Text>
          <Text className="mt-1 text-xs text-app-muted">
            {relatedTeams.map((team) => team.name).join(' • ') || 'Sem time'}
          </Text>
        </View>
        <StatusBadge status={task.status} />
      </View>

      {task.description ? (
        <Text className="mt-3 text-sm leading-5 text-white/90">{task.description}</Text>
      ) : null}

      {dueDateLabel ? <Text className="mt-3 text-xs text-app-muted">Vencimento: {dueDateLabel}</Text> : null}

      <View className="mt-2 flex-row flex-wrap">
        {relatedTeams.map((team) => (
          <TeamChip key={team.id} label={team.name} colorHex={team.colorHex} />
        ))}
      </View>
    </Pressable>
  );
}
