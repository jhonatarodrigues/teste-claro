import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TeamHorizontalList } from '../components/teams/TeamHorizontalList';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Screen } from '../components/ui/Screen';
import { SectionTitle } from '../components/ui/SectionTitle';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useTasks } from '../hooks/useTasks';
import { useTeams } from '../hooks/useTeams';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Tasks'>;

export function TasksScreen({ navigation, route }: Props) {
  const initialTeamId = route.params?.teamId;
  const { filters, search, setSearch, setStatus, status, teamId, setTeamId } = useTaskFilters(initialTeamId);
  const { data: tasksResponse } = useTasks(filters);
  const { data: teamsResponse } = useTeams();

  const teams = teamsResponse?.data ?? [];
  const tasks = tasksResponse?.data ?? [];

  return (
    <Screen
      scroll
      header={
        <View className="pt-4">
          <Pressable onPress={() => navigation.goBack()} className="h-12 w-12 items-start justify-center">
            <ChevronLeft color="#ffffff" size={20} />
          </Pressable>

          <View className="mt-6">
            <SectionTitle title="Tarefas" subtitle="adicione a galera e separe os times" />
          </View>
        </View>
      }
    >
      <View>
        <View className="mt-8">
          <TeamHorizontalList teams={teams} activeTeamId={teamId} onSelect={setTeamId} />
        </View>

        <View className="mt-4">
          <TaskFilterBar
            search={search}
            status={status}
            teamId={teamId}
            teams={teams}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onTeamChange={setTeamId}
          />
        </View>

        <View className="mt-5 gap-3">
          {tasks.length ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                teams={teams}
                onPress={() => navigation.navigate('TaskDetails', { taskId: task.id })}
              />
            ))
          ) : (
            <EmptyState
              title="Nenhuma tarefa encontrada"
              description="Ajuste os filtros ou crie uma nova tarefa para esse contexto."
            />
          )}
        </View>

        <View className="mt-6">
          <Button title="Nova Tarefa" onPress={() => navigation.navigate('TaskForm', { teamId })} />
        </View>
      </View>
    </Screen>
  );
}
