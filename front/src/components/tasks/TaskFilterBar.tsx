import { Search } from 'lucide-react-native';
import { Text, TextInput, View } from 'react-native';

import { Team } from '../../types/team';
import { TaskStatus } from '../../types/task';
import { Select } from '../ui/Select';

type TaskFilterBarProps = {
  search: string;
  status?: TaskStatus;
  teamId?: string;
  teams: Team[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value?: TaskStatus) => void;
  onTeamChange: (value?: string) => void;
};

export function TaskFilterBar({
  search,
  status,
  teamId,
  teams,
  onSearchChange,
  onStatusChange,
  onTeamChange,
}: TaskFilterBarProps) {
  return (
    <View className="gap-3">
      <View className="h-12 flex-row items-center rounded-xl bg-app-input px-4">
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Busque uma tarefa"
          placeholderTextColor="#63636f"
          className="flex-1 text-white"
        />
        <Search size={18} color="#00b37e" />
      </View>

      <Select
        placeholder="Filtrar por time"
        value={teamId}
        options={[
          { label: 'Todos os times', value: '__all__' },
          ...teams.map((team) => ({ label: team.name, value: team.id })),
        ]}
        onChange={(value) => onTeamChange(value === '__all__' ? undefined : value)}
      />

      <Select
        placeholder="Filtrar por status"
        value={status}
        options={[
          { label: 'Todos os status', value: '__all__' },
          { label: 'Pendente', value: 'Pendente' },
          { label: 'Em Progresso', value: 'Em Progresso' },
          { label: 'Concluida', value: 'Concluida' },
        ]}
        onChange={(value) => onStatusChange(value === '__all__' ? undefined : (value as TaskStatus))}
      />
    </View>
  );
}
