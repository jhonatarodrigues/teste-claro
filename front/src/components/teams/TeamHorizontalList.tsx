import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Team } from '../../types/team';

type TeamHorizontalListProps = {
  teams: Team[];
  activeTeamId?: string;
  onSelect: (teamId?: string) => void;
};

export function TeamHorizontalList({ teams, activeTeamId, onSelect }: TeamHorizontalListProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
      <TouchableOpacity
        onPress={() => onSelect(undefined)}
        className={`rounded-full px-4 py-2 ${!activeTeamId ? 'bg-app-accent' : 'bg-app-surface'}`}
      >
        <Text className="text-sm font-medium text-white">Todos</Text>
      </TouchableOpacity>

      {teams.map((team) => {
        const active = team.id === activeTeamId;
        return (
          <TouchableOpacity
            key={team.id}
            onPress={() => onSelect(team.id)}
            className={`flex-row items-center rounded-full px-4 py-2 ${active ? 'bg-app-accent' : 'bg-app-surface'}`}
          >
            <View className="mr-2 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: team.colorHex }} />
            <Text className="text-sm font-medium text-white">{team.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
