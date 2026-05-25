import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TeamHorizontalList } from '../components/teams/TeamHorizontalList';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
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
    <SafeAreaView className="flex-1 bg-app-bg">
      <ScrollView
        className="flex-1 bg-app-bg"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <View className="bg-app-bg px-5 pt-4">
          <Pressable onPress={() => navigation.goBack()} className="h-12 w-12 items-start justify-center">
            <ChevronLeft color="#ffffff" size={20} />
          </Pressable>

          <View className="mt-6">
            <SectionTitle title="Tarefas" subtitle="adicione a galera e separe os times" />
          </View>
        </View>

        <View className="bg-app-bg px-5 pb-4 pt-8">
          <View testID="tasks-team-carousel-container" className="-mx-5">
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
        </View>

        <View className="px-5">
          <View className="mt-5 gap-3">
            {tasks.length ? (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  teams={teams}
                  onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
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
      </ScrollView>
    </SafeAreaView>
  );
}
