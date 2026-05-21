import { Text, TextInput, TextInputProps, View } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, multiline, ...props }: InputProps) {
  return (
    <View className="gap-2">
      {label ? <Text className="text-sm text-app-muted">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#63636f"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`rounded-xl bg-app-input px-4 text-white ${multiline ? 'min-h-[110px] py-4' : 'h-12'}`}
        {...props}
      />
      {error ? <Text className="text-xs text-app-danger">{error}</Text> : null}
    </View>
  );
}
