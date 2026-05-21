import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, UsersRound } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Screen } from '../components/ui/Screen';
import { useTeamMutations } from '../hooks/useTeamMutations';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamForm'>;

const colorPalette = ['#E7FF2F', '#8BFF3D', '#22D3EE', '#F97316', '#A855F7'];

type TeamFormValues = {
  name: string;
  colorHex: string;
};

export function TeamFormScreen({ navigation }: Props) {
  const { createTeam } = useTeamMutations();
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamFormValues>({
    defaultValues: {
      name: '',
      colorHex: colorPalette[0],
    },
  });

  const selectedColor = watch('colorHex');

  const onSubmit = async (values: TeamFormValues) => {
    await createTeam.mutateAsync(values);
    navigation.goBack();
  };

  return (
    <Screen scroll>
      <View className="pt-4">
        <Pressable onPress={() => navigation.goBack()} className="h-12 w-12 items-start justify-center">
          <ChevronLeft color="#ffffff" size={20} />
        </Pressable>

        <View className="mt-10 items-center">
          <UsersRound color="#00b37e" size={34} />
          <Text className="mt-6 text-[32px] font-bold text-white">Novo Time</Text>
          <Text className="mt-2 text-sm text-app-muted">crie seu time para gerenciar as tarefas</Text>
        </View>

        <View className="mt-10 gap-4">
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Informe o nome do time', minLength: 3 }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome do time"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <View className="rounded-xl bg-app-input px-4 py-4">
            <Text className="text-[#63636f]">Cor do time</Text>
            <View className="mt-4 flex-row flex-wrap gap-3">
              {colorPalette.map((color) => {
                const active = color === selectedColor;

                return (
                  <Pressable
                    key={color}
                    onPress={() => setValue('colorHex', color)}
                    className={`h-8 w-8 rounded-full border-2 ${active ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                );
              })}
            </View>
          </View>

          <Button title="Criar" onPress={handleSubmit(onSubmit)} loading={createTeam.isPending} />
        </View>
      </View>
    </Screen>
  );
}
