import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
};

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: ButtonProps) {
  const base =
    variant === 'primary'
      ? 'bg-app-accent'
      : variant === 'danger'
        ? 'bg-app-danger'
        : 'bg-app-surface border border-app-border';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`min-h-[52px] items-center justify-center rounded-xl ${base} ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className="text-base font-semibold text-white">{title}</Text>
      )}
    </Pressable>
  );
}
