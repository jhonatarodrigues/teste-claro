import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { Alert, Pressable, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Screen } from '../components/ui/Screen';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TeamChip } from '../components/ui/TeamChip';
import { useTask } from '../hooks/useTask';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { useTeams } from '../hooks/useTeams';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

const nextStatusMap = {
  Pendente: 'Em Progresso',
  'Em Progresso': 'Concluida',
  Concluida: 'Pendente',
} as const;

export function TaskDetailsScreen({ navigation, route }: Props) {
  const taskId = route.params.taskId;
  const { data: taskResponse, isLoading } = useTask(taskId);
  const { data: teamsResponse } = useTeams();
  const { deleteTask, updateStatus } = useTaskMutations();

  const teams = teamsResponse?.data ?? [];
  const task = taskResponse?.data;

  return (
    <Screen
      scroll
      header={
        <View className="pt-4">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => navigation.goBack()} className="h-12 w-12 items-start justify-center">
              <ChevronLeft color="#ffffff" size={20} />
            </Pressable>
            <Pressable
              onPress={() =>
                Alert.alert('Excluir tarefa', 'Deseja remover essa tarefa?', [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                      await deleteTask.mutateAsync(taskId);
                      navigation.goBack();
                    },
                  },
                ])
              }
              className="h-12 w-12 items-end justify-center"
            >
              <Trash2 color="#ffffff" size={18} />
            </Pressable>
          </View>
        </View>
      }
    >
      <View>
        {!task && !isLoading ? (
          <View className="mt-10">
            <EmptyState
              title="Tarefa não encontrada"
              description="Essa tarefa não está mais disponível no mock atual."
            />
          </View>
        ) : null}

        {task ? (
          <>
            <View className="mt-10 rounded-card bg-app-surface px-5 py-6">
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-white">{task.title}</Text>
                  <Text className="mt-3 text-sm leading-6 text-white/85">
                    {task.description || 'Sem descrição para esta tarefa.'}
                  </Text>
                </View>
                <StatusBadge status={task.status} />
              </View>

              <View className="mt-5 flex-row flex-wrap">
                {teams
                  .filter((team) => task.teamIds.includes(team.id))
                  .map((team) => (
                    <TeamChip key={team.id} label={team.name} colorHex={team.colorHex} />
                  ))}
              </View>
            </View>

            <View className="mt-5 gap-3">
              <Button title="Editar tarefa" onPress={() => navigation.navigate('TaskForm', { taskId })} />
              <Button
                title={`Mover para ${nextStatusMap[task.status]}`}
                variant="ghost"
                onPress={async () => {
                  await updateStatus.mutateAsync({
                    id: taskId,
                    status: nextStatusMap[task.status],
                  });
                  navigation.replace('TaskDetails', { taskId });
                }}
              />
            </View>
          </>
        ) : null}
      </View>
    </Screen>
  );
}
