import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, UsersRound } from 'lucide-react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { ColorPickerField } from '../components/ui/ColorPickerField';
import { Input } from '../components/ui/Input';
import { Screen } from '../components/ui/Screen';
import { useTeamMutations } from '../hooks/useTeamMutations';
import { RootStackParamList } from '../navigation/types';
import { teamFormSchema, TeamFormValues } from '../schemas/teamForm';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamForm'>;

export function TeamFormScreen({ navigation }: Props) {
  const { createTeam } = useTeamMutations();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      colorHex: '#E7FF2F',
    },
  });

  const onSubmit = async (values: TeamFormValues) => {
    await createTeam.mutateAsync(values);
    navigation.goBack();
  };

  return (
    <Screen
      scroll
      header={
        <View className="pt-4">
          <Pressable onPress={() => navigation.goBack()} className="h-12 w-12 items-start justify-center">
            <ChevronLeft color="#ffffff" size={20} />
          </Pressable>

          <View className="mt-10 items-center">
            <UsersRound color="#00b37e" size={34} />
            <Text className="mt-6 text-[32px] font-bold text-white">Novo Time</Text>
            <Text className="mt-2 text-sm text-app-muted">crie seu time para gerenciar as tarefas</Text>
          </View>
        </View>
      }
    >
      <View className="mt-10 gap-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input placeholder="Nome do time" value={value} onChangeText={onChange} error={errors.name?.message} />
          )}
        />

        <Controller
          control={control}
          name="colorHex"
          render={({ field: { onChange, value } }) => (
            <ColorPickerField value={value} onChange={onChange} error={errors.colorHex?.message} />
          )}
        />

        <Button title="Criar" onPress={handleSubmit(onSubmit)} loading={createTeam.isPending} />
      </View>
    </Screen>
  );
}
