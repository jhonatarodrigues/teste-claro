import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCheck, ChevronLeft, Trash2 } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { TaskForm, TaskFormData } from '../components/tasks/TaskForm';
import { EmptyState } from '../components/ui/EmptyState';
import { Screen } from '../components/ui/Screen';
import { useTask } from '../hooks/useTask';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { useTeams } from '../hooks/useTeams';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

export function TaskFormScreen({ navigation, route }: Props) {
  const taskId = route.params?.taskId;
  const presetTeamId = route.params?.teamId;
  const editing = Boolean(taskId);
  const { data: teamsResponse } = useTeams();
  const { data: taskResponse, isLoading } = useTask(taskId);
  const { createTask, updateTask, deleteTask } = useTaskMutations();

  const teams = teamsResponse?.data ?? [];
  const currentTask = taskResponse?.data;

  const defaultValues = currentTask
    ? {
        title: currentTask.title,
        description: currentTask.description ?? '',
        status: currentTask.status,
        dueDate: currentTask.dueDate ?? '',
        teamIds: currentTask.teamIds,
      }
    : {
        title: '',
        description: '',
        status: 'Pendente' as const,
        dueDate: '',
        teamIds: presetTeamId ? [presetTeamId] : [],
      };

  const handleSubmit = async (values: TaskFormData) => {
    if (editing && taskId) {
      await updateTask.mutateAsync({ id: taskId, input: { status: values.status } });
    } else {
      await createTask.mutateAsync(values);
    }

    navigation.goBack();
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
            {editing && taskId ? (
              <Pressable
                onPress={
                  deleteTask.isPending
                    ? undefined
                    : async () => {
                        await deleteTask.mutateAsync(taskId);
                        navigation.popToTop();
                      }
                }
                disabled={deleteTask.isPending}
                testID="task-delete-action"
                className="h-12 w-12 items-end justify-center"
              >
                {deleteTask.isPending ? (
                  <ActivityIndicator testID="task-delete-loading" color="#ffffff" size="small" />
                ) : (
                  <Trash2 color="#ffffff" size={18} />
                )}
              </Pressable>
            ) : (
              <View className="h-12 w-12" />
            )}
          </View>

          <View className="mt-10 items-center">
            <View className="h-16 w-16 items-center justify-center rounded-2xl border border-app-accent">
              <CheckCheck color="#00b37e" size={32} />
            </View>
            <Text className="mt-6 text-[32px] font-bold text-white">
              {editing ? 'Editar tarefa' : 'Nova tarefa'}
            </Text>
            <Text className="mt-2 text-sm text-app-muted">crie seu time para gerenciar as tarefas</Text>
          </View>
        </View>
      }
    >
      <View className="mt-10">
        {editing && !currentTask && !isLoading ? (
          <EmptyState
            title="Tarefa não encontrada"
            description="Não foi possível carregar essa tarefa para edição."
          />
        ) : (
          <TaskForm
            teams={teams}
            defaultValues={defaultValues}
            submitLabel={editing ? 'Salvar' : 'Criar'}
            onSubmit={handleSubmit}
            loading={createTask.isPending || updateTask.isPending}
            statusOnlyEdit={editing}
          />
        )}
      </View>
    </Screen>
  );
}
