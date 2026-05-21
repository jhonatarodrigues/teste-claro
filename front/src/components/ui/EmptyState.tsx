import { Text, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="rounded-card bg-app-surface px-5 py-6">
      <Text className="text-base font-semibold text-white">{title}</Text>
      <Text className="mt-2 text-sm leading-5 text-app-muted">{description}</Text>
    </View>
  );
}
