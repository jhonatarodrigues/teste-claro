import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DrawerMenuButton } from '../components/navigation/DrawerMenuButton';
import { TeamCard } from '../components/teams/TeamCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionTitle } from '../components/ui/SectionTitle';
import { useInfiniteTeams } from '../hooks/useInfiniteTeams';
import { useTeamMutations } from '../hooks/useTeamMutations';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Teams'>;

export function TeamsScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const { removeTeam } = useTeamMutations();
  const {
    data: teamsResponse,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteTeams({
    search,
    limit: 10,
  });

  const teams = teamsResponse?.pages.flatMap((page) => page.data) ?? [];
  const totalTeams = teamsResponse?.pages.at(-1)?.meta.total ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      <View className="bg-app-bg px-5 pt-4">
        <DrawerMenuButton
          testID="teams-drawer-button"
          onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
        />

        <View className="mt-6">
          <SectionTitle title="Times" subtitle="Acesse um dos times" />
        </View>
      </View>

      <FlatList
        testID="teams-list"
        data={teams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3">
            <TeamCard
              team={item}
              tasksCount={item.taskCount ?? 0}
              onPress={() => navigation.navigate('Tasks', { teamId: item.id, teamName: item.name })}
              onEdit={() => navigation.navigate('TeamForm', { teamId: item.id })}
              onDelete={() =>
                Alert.alert(
                  'Excluir time',
                  'As tarefas serão mantidas e o time será desvinculado delas.',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Excluir',
                      style: 'destructive',
                      onPress: async () => {
                        await removeTeam.mutateAsync(item.id);
                      },
                    },
                  ],
                )
              }
            />
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.35}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        }}
        ListHeaderComponent={
          <View testID="teams-list-header" className="pb-4 pt-8">
            <View className="h-12 flex-row items-center rounded-xl bg-app-input px-4">
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Busque um time"
                placeholderTextColor="#63636f"
                className="flex-1 text-white"
              />
              <Search color="#00b37e" size={18} />
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator color="#00b37e" />
              <Text className="mt-3 text-sm text-app-muted">Carregando times...</Text>
            </View>
          ) : isError ? (
            <EmptyState
              title="Não foi possível carregar os times"
              description="Tente novamente em instantes para continuar."
            />
          ) : (
            <EmptyState title="Nenhum time encontrado" description="Ajuste sua busca ou crie um novo time." />
          )
        }
        ListFooterComponent={
          <View className="pb-2 pt-2">
            {teams.length ? (
              <View className="items-center">
                <Text className="text-sm text-app-muted">
                  Mostrando {teams.length} de {totalTeams} times
                </Text>
                {isFetchingNextPage ? (
                  <View className="mt-3 flex-row items-center gap-2">
                    <ActivityIndicator color="#00b37e" size="small" />
                    <Text className="text-sm text-app-muted">Carregando mais times...</Text>
                  </View>
                ) : hasNextPage ? (
                  <Text className="mt-3 text-sm text-app-muted">Role para carregar mais</Text>
                ) : null}
              </View>
            ) : null}

            <View className="mt-6">
              <Button title="Ver todas as tarefas" variant="ghost" onPress={() => navigation.navigate('Tasks')} />
            </View>

            <View className="mt-3">
              <Button title="Criar time" onPress={() => navigation.navigate('TeamForm')} />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
