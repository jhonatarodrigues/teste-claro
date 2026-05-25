import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, UsersRound } from 'lucide-react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { ColorPickerField } from '../components/ui/ColorPickerField';
import { Input } from '../components/ui/Input';
import { Screen } from '../components/ui/Screen';
import { useTeam } from '../hooks/useTeam';
import { useTeamMutations } from '../hooks/useTeamMutations';
import { RootStackParamList } from '../navigation/types';
import { teamFormSchema, TeamFormValues } from '../schemas/teamForm';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamForm'>;

export function TeamFormScreen({ navigation, route }: Props) {
  const teamId = route.params?.teamId;
  const isEditMode = Boolean(teamId);
  const { data: teamResponse } = useTeam(teamId);
  const { createTeam, updateTeam, removeTeam } = useTeamMutations();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      colorHex: '#E7FF2F',
    },
  });

  useEffect(() => {
    if (!teamResponse?.data) {
      return;
    }

    reset({
      name: teamResponse.data.name,
      colorHex: teamResponse.data.colorHex,
    });
  }, [reset, teamResponse]);

  const onSubmit = async (values: TeamFormValues) => {
    if (teamId) {
      await updateTeam.mutateAsync({
        id: teamId,
        input: values,
      });
    } else {
      await createTeam.mutateAsync(values);
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    if (!teamId) {
      return;
    }

    Alert.alert('Excluir time', 'As tarefas serão mantidas e o time será desvinculado delas.', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await removeTeam.mutateAsync(teamId);
          navigation.goBack();
        },
      },
    ]);
  };

  const isSubmitting = createTeam.isPending || updateTeam.isPending || removeTeam.isPending;

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
            <Text className="mt-6 text-[32px] font-bold text-white">{isEditMode ? 'Editar Time' : 'Novo Time'}</Text>
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

        <Button
          title={isEditMode ? 'Salvar' : 'Criar'}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
        {isEditMode ? (
          <Button title="Excluir time" variant="danger" onPress={handleDelete} disabled={isSubmitting} />
        ) : null}
      </View>
    </Screen>
  );
}
