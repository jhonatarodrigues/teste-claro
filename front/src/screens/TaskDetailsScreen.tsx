import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Screen } from '../components/ui/Screen';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TeamChip } from '../components/ui/TeamChip';
import { useTask } from '../hooks/useTask';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { useTeams } from '../hooks/useTeams';
import { RootStackParamList } from '../navigation/types';
import { formatDueDateLabel } from '../utils/due-date';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

export function TaskDetailsScreen({ navigation, route }: Props) {
  const taskId = route.params.taskId;
  const { data: taskResponse, isLoading } = useTask(taskId);
  const { data: teamsResponse } = useTeams({ limit: 1000 });
  const { deleteTask, updateStatus } = useTaskMutations();

  const teams = teamsResponse?.data ?? [];
  const task = taskResponse?.data;
  const dueDateLabel = formatDueDateLabel(task?.dueDate);

  const handleDelete = () => {
    Alert.alert('Excluir tarefa', 'Deseja remover essa tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask.mutateAsync(taskId);
            navigation.goBack();
          } catch {
            Alert.alert('Não foi possível excluir a tarefa', 'Tente novamente em instantes.');
          }
        },
      },
    ]);
  };

  const handleCompleteTask = async () => {
    try {
      await updateStatus.mutateAsync({
        id: taskId,
        status: 'Concluida',
      });
    } catch {
      Alert.alert('Não foi possível atualizar o status', 'Tente novamente em instantes.');
    }
  };

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
              onPress={deleteTask.isPending ? undefined : handleDelete}
              disabled={deleteTask.isPending}
              testID="task-details-delete-action"
              className="h-12 w-12 items-end justify-center"
            >
              {deleteTask.isPending ? <ActivityIndicator color="#ffffff" size="small" /> : <Trash2 color="#ffffff" size={18} />}
            </Pressable>
          </View>
        </View>
      }
    >
      <View>
        {isLoading ? (
          <View className="mt-10 items-center py-8">
            <ActivityIndicator color="#00b37e" />
            <Text className="mt-3 text-sm text-app-muted">Carregando detalhes da tarefa...</Text>
          </View>
        ) : null}

        {!task && !isLoading ? (
          <View className="mt-10">
            <EmptyState
              title="Tarefa não encontrada"
              description="Não foi possível carregar os detalhes desta tarefa."
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
                  {dueDateLabel ? <Text className="mt-3 text-sm text-app-muted">Vencimento: {dueDateLabel}</Text> : null}
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
                title={task.status === 'Concluida' ? 'Tarefa concluida' : 'Marcar como concluida'}
                variant="ghost"
                onPress={handleCompleteTask}
                loading={updateStatus.isPending}
                disabled={task.status === 'Concluida'}
              />
            </View>
          </>
        ) : null}
      </View>
    </Screen>
  );
}
