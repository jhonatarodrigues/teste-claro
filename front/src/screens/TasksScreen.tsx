import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import { useRef } from 'react';
import { ActivityIndicator, Animated, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TeamHorizontalList } from '../components/teams/TeamHorizontalList';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionTitle } from '../components/ui/SectionTitle';
import { useInfiniteTasks } from '../hooks/useInfiniteTasks';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useTeams } from '../hooks/useTeams';
import { RootStackParamList } from '../navigation/types';
import { Task } from '../types/task';

type Props = NativeStackScreenProps<RootStackParamList, 'Tasks'>;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Task>);

export function TasksScreen({ navigation, route }: Props) {
  const initialTeamId = route.params?.teamId;
  const teamName = route.params?.teamName;
  const { filters, search, setSearch, setStatus, status, teamId, setTeamId } = useTaskFilters(initialTeamId);
  const { data: tasksResponse, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteTasks(filters);
  const { data: teamsResponse, isError: isTeamsError } = useTeams({ limit: 1000 });
  const scrollY = useRef(new Animated.Value(0)).current;

  const teams = teamsResponse?.data ?? [];
  const tasks = tasksResponse?.pages.flatMap((page) => page.data) ?? [];
  const totalTasks = tasksResponse?.pages.at(-1)?.meta.total ?? 0;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 72],
    outputRange: [112, 0],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 56],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 72],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      <Animated.View
        testID="tasks-collapsible-header"
        className="overflow-hidden bg-app-bg px-5"
        style={{
          height: headerHeight,
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }],
        }}
      >
        <View className="pt-4">
          <Pressable onPress={() => navigation.goBack()} className="h-12 w-12 items-start justify-center">
            <ChevronLeft color="#ffffff" size={20} />
          </Pressable>

          <View className="mt-6">
            <SectionTitle
              title="Tarefas"
              subtitle={teamName ? `Filtradas por ${teamName}` : 'Visualize e organize todas as tarefas'}
            />
          </View>
        </View>
      </Animated.View>

      <View testID="tasks-fixed-carousel" className="bg-app-bg px-5 pb-4 pt-8">
        <View testID="tasks-team-carousel-container" className="-mx-5">
          <TeamHorizontalList teams={teams} activeTeamId={teamId} onSelect={setTeamId} />
        </View>
      </View>

      <AnimatedFlatList
        testID="tasks-list"
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3 px-5">
            <TaskCard task={item} teams={teams} onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })} />
          </View>
        )}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.35}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View className="bg-app-bg px-5 pb-4 pt-2">
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
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="items-center px-5 py-8">
              <ActivityIndicator testID="tasks-loading-indicator" color="#00b37e" />
              <Text className="mt-3 text-sm text-app-muted">Carregando tarefas...</Text>
            </View>
          ) : isError || isTeamsError ? (
            <View className="px-5">
              <EmptyState
                title="Não foi possível carregar as tarefas"
                description="Tente novamente em instantes para continuar."
              />
            </View>
          ) : (
            <View className="px-5">
              <EmptyState
                title="Nenhuma tarefa encontrada"
                description="Ajuste os filtros ou crie uma nova tarefa para esse contexto."
              />
            </View>
          )
        }
        ListFooterComponent={
          <View className="px-5 pb-6 pt-2">
            {tasks.length ? (
              <View className="items-center">
                <Text className="text-sm text-app-muted">
                  Mostrando {tasks.length} de {totalTasks} tarefas
                </Text>
                {isFetchingNextPage ? (
                  <View className="mt-3 flex-row items-center gap-2">
                    <ActivityIndicator color="#00b37e" size="small" />
                    <Text className="text-sm text-app-muted">Carregando mais tarefas...</Text>
                  </View>
                ) : hasNextPage ? (
                  <Text className="mt-3 text-sm text-app-muted">Role para carregar mais</Text>
                ) : null}
              </View>
            ) : null}

            <View className="mt-6">
              <Button title="Nova Tarefa" onPress={() => navigation.navigate('TaskForm', { teamId })} />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
