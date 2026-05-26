import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDays, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

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

  const displayValue = useMemo(() => formatDueDateLabel(value), [value]);
  const pickerDate = useMemo(() => parseDueDateInput(value) ?? new Date(), [value]);

  const openPicker = () => {
    setVisible(true);
  };

  const closePicker = () => {
    setVisible(false);
  };

  const clearSelection = () => {
    onChange('');
    if (Platform.OS !== 'ios') {
      closePicker();
    }
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

      {visible ? (
        <View testID="due-date-picker-container" className="rounded-2xl bg-app-surface px-3 py-2">
          <View className="mb-2 flex-row items-center justify-between px-1 pt-1">
            <Text className="text-base font-semibold text-white">Data de vencimento</Text>
            {value ? (
              <Pressable onPress={clearSelection} testID="due-date-clear-action" className="h-10 w-10 items-center justify-center">
                <X color="#ffffff" size={18} />
              </Pressable>
            ) : (
              <Pressable onPress={closePicker} className="h-10 items-center justify-center px-2">
                <Text className="text-sm font-semibold text-app-muted">Fechar</Text>
              </Pressable>
            )}
          </View>

          <DateTimePicker
            value={pickerDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              if (Platform.OS === 'android') {
                setVisible(false);
              }

              if (!selectedDate) {
                return;
              }

              onChange(dateToDateOnlyInput(selectedDate));

              if (Platform.OS !== 'ios') {
                closePicker();
              }
            }}
            testID="due-date-picker-native"
          />

          {Platform.OS === 'ios' ? (
            <View className="mt-2 flex-row justify-end px-1 pb-1">
              <Pressable onPress={closePicker} className="h-10 items-center justify-center px-2">
                <Text className="text-sm font-semibold text-app-accent">Concluir</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
