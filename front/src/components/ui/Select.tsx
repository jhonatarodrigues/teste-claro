import { ChevronDown, Check } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  placeholder: string;
  options: SelectOption[];
  value?: string;
  values?: string[];
  onChange: (value: string) => void;
  onMultiChange?: (values: string[]) => void;
  error?: string;
  multiple?: boolean;
  disabled?: boolean;
};

export function Select({
  label,
  placeholder,
  options,
  value,
  values = [],
  onChange,
  onMultiChange,
  error,
  multiple = false,
  disabled = false,
}: SelectProps) {
  const [visible, setVisible] = useState(false);

  const displayValue = useMemo(() => {
    if (multiple) {
      if (!values.length) return placeholder;
      if (values.length === 1) {
        return options.find((option) => option.value === values[0])?.label ?? placeholder;
      }

      return `${values.length} times selecionados`;
    }

    return options.find((option) => option.value === value)?.label ?? placeholder;
  }, [multiple, options, placeholder, value, values]);

  const toggleValue = (nextValue: string) => {
    if (!multiple) {
      onChange(nextValue);
      setVisible(false);
      return;
    }

    const alreadySelected = values.includes(nextValue);
    const next = alreadySelected ? values.filter((item) => item !== nextValue) : [...values, nextValue];
    onMultiChange?.(next);
  };

  return (
    <View className="gap-2">
      {label ? <Text className="text-sm text-app-muted">{label}</Text> : null}
      <Pressable
        onPress={disabled ? undefined : () => setVisible(true)}
        disabled={disabled}
        className={`h-12 flex-row items-center justify-between rounded-xl px-4 ${
          disabled ? 'bg-app-surface opacity-70' : 'bg-app-input'
        }`}
      >
        <Text className={`${displayValue === placeholder ? 'text-[#63636f]' : 'text-white'}`}>
          {displayValue}
        </Text>
        <ChevronDown color="#8f8f9a" size={18} />
      </Pressable>
      {error ? <Text className="text-xs text-app-danger">{error}</Text> : null}

      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable className="flex-1 items-center justify-center bg-black/50 px-6" onPress={() => setVisible(false)}>
          <Pressable className="w-full rounded-2xl bg-app-surface p-4" onPress={() => undefined}>
            <Text className="mb-3 text-lg font-semibold text-white">{placeholder}</Text>
            <View className="gap-2">
              {options.map((option) => {
                const selected = multiple ? values.includes(option.value) : option.value === value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => toggleValue(option.value)}
                    className="flex-row items-center justify-between rounded-xl bg-app-bg px-4 py-3"
                  >
                    <Text className="text-white">{option.label}</Text>
                    {selected ? <Check color="#00b37e" size={16} /> : null}
                  </Pressable>
                );
              })}
            </View>
            {multiple ? (
              <Pressable
                onPress={() => setVisible(false)}
                className="mt-4 h-11 items-center justify-center rounded-xl bg-app-accent"
              >
                <Text className="font-semibold text-white">Confirmar</Text>
              </Pressable>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
