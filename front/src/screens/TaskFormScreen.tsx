import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { CheckCheck, ChevronLeft, Trash2 } from 'lucide-react-native';
import { useMemo } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import { DrawerMenuButton } from '../components/navigation/DrawerMenuButton';
import { TaskForm, TaskFormData } from '../components/tasks/TaskForm';
import { EmptyState } from '../components/ui/EmptyState';
import { Screen } from '../components/ui/Screen';
import { useAllTeams } from '../hooks/useAllTeams';
import { useTask } from '../hooks/useTask';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { RootStackParamList } from '../navigation/types';
import { formatDueDateInput, normalizeDueDateInput } from '../utils/due-date';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

export function TaskFormScreen({ navigation, route }: Props) {
  const taskId = route.params?.taskId;
  const presetTeamId = route.params?.teamId;
  const editing = Boolean(taskId);
  const { data: teams = [] } = useAllTeams();
  const { data: taskResponse, isLoading } = useTask(taskId);
  const { createTask, updateTask, deleteTask } = useTaskMutations();

  const currentTask = taskResponse?.data;

  const defaultValues = useMemo(
    () =>
      currentTask
        ? {
            title: currentTask.title,
            description: currentTask.description ?? '',
            status: currentTask.status,
            dueDate: formatDueDateInput(currentTask.dueDate),
            teamIds: currentTask.teamIds,
          }
        : {
            title: '',
            description: '',
            status: 'Pendente' as const,
            dueDate: '',
            teamIds: presetTeamId ? [presetTeamId] : [],
          },
    [currentTask, presetTeamId],
  );

  const handleSubmit = async (values: TaskFormData) => {
    const input = {
      ...values,
      dueDate: normalizeDueDateInput(values.dueDate),
    };

    try {
      if (editing && taskId) {
        await updateTask.mutateAsync({ id: taskId, input });
      } else {
        await createTask.mutateAsync(input);
      }

      navigation.goBack();
    } catch {
      Alert.alert(
        'Não foi possível salvar a tarefa',
        'Revise os dados informados e tente novamente em instantes.',
      );
    }
  };

  const handleDelete = () => {
    if (!taskId || deleteTask.isPending) {
      return;
    }

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

  return (
    <Screen
      scroll
      header={
        <View className="pt-4">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => navigation.goBack()} className="h-12 w-12 items-start justify-center">
              <ChevronLeft color="#ffffff" size={20} />
            </Pressable>
            <View className="flex-row items-center gap-3">
              <DrawerMenuButton
                testID="task-form-drawer-button"
                onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
              />
              {editing && taskId ? (
                <Pressable
                  onPress={deleteTask.isPending ? undefined : handleDelete}
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
        {editing && isLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator color="#00b37e" />
            <Text className="mt-3 text-sm text-app-muted">Carregando tarefa...</Text>
          </View>
        ) : editing && !currentTask ? (
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
          />
        )}
      </View>
    </Screen>
  );
}
