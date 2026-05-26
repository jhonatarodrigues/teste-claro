import { Menu } from 'lucide-react-native';
import { Pressable } from 'react-native';

type DrawerMenuButtonProps = {
  onPress: () => void;
  testID?: string;
};

export function DrawerMenuButton({ onPress, testID }: DrawerMenuButtonProps) {
  return (
    <Pressable onPress={onPress} testID={testID} className="h-12 w-12 items-center justify-center rounded-full bg-app-surface">
      <Menu color="#ffffff" size={20} />
    </Pressable>
  );
}
