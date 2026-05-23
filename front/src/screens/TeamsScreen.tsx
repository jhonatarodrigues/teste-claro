import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';

import { TeamCard } from '../components/teams/TeamCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Screen } from '../components/ui/Screen';
import { SectionTitle } from '../components/ui/SectionTitle';
import { useTasks } from '../hooks/useTasks';
import { useTeams } from '../hooks/useTeams';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Teams'>;

export function TeamsScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const { data: teamsResponse } = useTeams({ search });
  const { data: tasksResponse } = useTasks({ limit: 50, offset: 0 });

  const tasksByTeam = useMemo(() => {
    const counts = new Map<string, number>();
    (tasksResponse?.data ?? []).forEach((task) => {
      task.teamIds.forEach((teamId) => {
        counts.set(teamId, (counts.get(teamId) ?? 0) + 1);
      });
    });
    return counts;
  }, [tasksResponse?.data]);

  const teams = teamsResponse?.data ?? [];

  return (
    <Screen
      scroll
      header={
        <View className="pt-16">
          <SectionTitle title="Times" subtitle="Acesse um dos times" />
        </View>
      }
    >
      <View>
        <View className="mt-8 h-12 flex-row items-center rounded-xl bg-app-input px-4">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Busque um time"
            placeholderTextColor="#63636f"
            className="flex-1 text-white"
          />
          <Search color="#00b37e" size={18} />
        </View>

        <View className="mt-4 gap-3">
          {teams.length ? (
            teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                tasksCount={tasksByTeam.get(team.id) ?? 0}
                onPress={() => navigation.navigate('Tasks', { teamId: team.id, teamName: team.name })}
              />
            ))
          ) : (
            <EmptyState title="Nenhum time encontrado" description="Ajuste sua busca ou crie um novo time." />
          )}
        </View>

        <View className="mt-6">
          <Button title="Criar time" onPress={() => navigation.navigate('TeamForm')} />
        </View>
      </View>
    </Screen>
  );
}
