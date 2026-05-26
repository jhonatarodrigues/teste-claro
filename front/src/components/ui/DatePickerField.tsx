import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDays, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { dateToDateOnlyInput, formatDueDateLabel, parseDueDateInput } from '../../utils/due-date';

type DatePickerFieldProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
};

export function DatePickerField({
  label,
  placeholder = 'Selecionar data de vencimento',
  value,
  onChange,
  error,
}: DatePickerFieldProps) {
  const [visible, setVisible] = useState(false);
  const [draftDate, setDraftDate] = useState<Date>(() => parseDueDateInput(value) ?? new Date());

  const displayValue = useMemo(() => formatDueDateLabel(value), [value]);

  const openPicker = () => {
    setDraftDate(parseDueDateInput(value) ?? new Date());
    setVisible(true);
  };

  const closePicker = () => {
    setVisible(false);
  };

  const confirmSelection = () => {
    onChange(dateToDateOnlyInput(draftDate));
    closePicker();
  };

  const clearSelection = () => {
    onChange('');
    closePicker();
  };

  return (
    <View className="gap-2">
      {label ? <Text className="text-sm text-app-muted">{label}</Text> : null}

      <Pressable
        onPress={openPicker}
        className="h-12 flex-row items-center justify-between rounded-xl bg-app-input px-4"
        testID="due-date-field-trigger"
      >
        <Text className={`${displayValue ? 'text-white' : 'text-[#63636f]'}`}>{displayValue ?? placeholder}</Text>
        <CalendarDays color="#8f8f9a" size={18} />
      </Pressable>

      {error ? <Text className="text-xs text-app-danger">{error}</Text> : null}

      <Modal transparent visible={visible} animationType="fade" onRequestClose={closePicker}>
        <Pressable className="flex-1 items-center justify-center bg-black/50 px-6" onPress={closePicker}>
          <Pressable className="w-full rounded-2xl bg-app-surface p-4" onPress={() => undefined}>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-white">Data de vencimento</Text>
              {value ? (
                <Pressable onPress={clearSelection} testID="due-date-clear-action" className="h-10 w-10 items-center justify-center">
                  <X color="#ffffff" size={18} />
                </Pressable>
              ) : (
                <View className="h-10 w-10" />
              )}
            </View>

            <DateTimePicker
              value={draftDate}
              mode="date"
              display="default"
              onChange={(_event, selectedDate) => {
                if (selectedDate) {
                  setDraftDate(selectedDate);
                }
              }}
              testID="due-date-picker-native"
            />

            <View className="mt-4 flex-row gap-3">
              <Pressable
                onPress={closePicker}
                className="h-11 flex-1 items-center justify-center rounded-xl border border-app-border bg-app-bg"
              >
                <Text className="font-semibold text-white">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={confirmSelection}
                className="h-11 flex-1 items-center justify-center rounded-xl bg-app-accent"
              >
                <Text className="font-semibold text-white">Confirmar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
