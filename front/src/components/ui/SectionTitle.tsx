import { Text, View } from 'react-native';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <View className="items-center">
      <Text className="text-[32px] font-bold text-white">{title}</Text>
      {subtitle ? <Text className="mt-1 text-sm text-app-muted">{subtitle}</Text> : null}
    </View>
  );
}
