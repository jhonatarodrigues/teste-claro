import { Text, TextInput, TextInputProps, View } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, multiline, ...props }: InputProps) {
  const editable = props.editable ?? true;

  return (
    <View className="gap-2">
      {label ? <Text className="text-sm text-app-muted">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#63636f"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`rounded-xl px-4 text-white ${editable ? 'bg-app-input' : 'bg-app-surface opacity-70'} ${
          multiline ? 'min-h-[110px] py-4' : 'h-12'
        }`}
        {...props}
      />
      {error ? <Text className="text-xs text-app-danger">{error}</Text> : null}
    </View>
  );
}
