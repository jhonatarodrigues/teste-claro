import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { z } from 'zod';

import { Team } from '../../types/team';
import { TaskStatus } from '../../types/task';
import { isAcceptedDueDateInput } from '../../utils/due-date';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export const taskFormSchema = z.object({
  title: z.string().trim().min(3, 'Informe pelo menos 3 caracteres'),
  description: z.string().trim().optional(),
  status: z.enum(['Pendente', 'Em Progresso', 'Concluida']),
  dueDate: z
    .string()
    .optional()
    .refine((value) => isAcceptedDueDateInput(value), 'Informe uma data valida no formato AAAA-MM-DD'),
  teamIds: z.array(z.string()),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

type TaskFormProps = {
  teams: Team[];
  defaultValues?: TaskFormData;
  submitLabel: string;
  onSubmit: (values: TaskFormData) => void;
  loading?: boolean;
};

export function TaskForm({
  teams,
  defaultValues,
  submitLabel,
  onSubmit,
  loading = false,
}: TaskFormProps) {
  const fallbackValues = useMemo<TaskFormData>(
    () => ({
      title: '',
      description: '',
      status: 'Pendente',
      dueDate: '',
      teamIds: [],
      ...defaultValues,
    }),
    [defaultValues],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: fallbackValues,
  });

  useEffect(() => {
    reset(fallbackValues);
  }, [fallbackValues, reset]);

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Título"
            value={value}
            onChangeText={onChange}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <Input
            multiline
            placeholder="Descrição"
            value={value}
            onChangeText={onChange}
            error={errors.description?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Data de vencimento (AAAA-MM-DD)"
            value={value}
            onChangeText={onChange}
            error={errors.dueDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="teamIds"
        render={({ field: { value, onChange } }) => (
          <Select
            placeholder="Selecione um ou mais times"
            multiple
            values={value}
            onMultiChange={onChange}
            options={teams.map((team) => ({ label: team.name, value: team.id }))}
            error={errors.teamIds?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field: { value, onChange } }) => (
          <Select
            placeholder="Selecione um status"
            value={value}
            onChange={(selected) => onChange(selected as TaskStatus)}
            options={[
              { label: 'Pendente', value: 'Pendente' },
              { label: 'Em Progresso', value: 'Em Progresso' },
              { label: 'Concluida', value: 'Concluida' },
            ]}
            error={errors.status?.message}
          />
        )}
      />

      {errors.root?.message ? <Text className="text-sm text-app-danger">{errors.root.message}</Text> : null}

      <Button title={submitLabel} onPress={handleSubmit(onSubmit)} loading={loading} />
    </View>
  );
}
