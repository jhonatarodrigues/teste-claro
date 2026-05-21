import { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  withBottomSpace?: boolean;
}>;

export function Screen({ children, scroll = false, withBottomSpace = true }: ScreenProps) {
  const content = (
    <View className={`flex-1 bg-app-bg px-5 ${withBottomSpace ? 'pb-6' : ''}`}>{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      {scroll ? (
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
