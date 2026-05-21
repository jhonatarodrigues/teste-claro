import { Text, View } from 'react-native';

type TeamChipProps = {
  label: string;
  colorHex: string;
};

export function TeamChip({ label, colorHex }: TeamChipProps) {
  return (
    <View className="mr-2 mt-2 flex-row items-center rounded-full bg-app-bg px-3 py-1.5">
      <View className="mr-2 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colorHex }} />
      <Text className="text-xs text-white">{label}</Text>
    </View>
  );
}
