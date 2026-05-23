import { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  withBottomSpace?: boolean;
  header?: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
}>;

export function Screen({
  children,
  scroll = false,
  withBottomSpace = true,
  header,
  headerClassName = '',
  contentClassName = '',
}: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-app-bg">
      {header ? (
        <View testID="screen-header" className={`bg-app-bg px-5 ${headerClassName}`.trim()}>
          {header}
        </View>
      ) : null}

      {scroll ? (
        <ScrollView
          testID="screen-scroll"
          className="flex-1 bg-app-bg"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: withBottomSpace ? 24 : 0,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className={`bg-app-bg ${contentClassName}`.trim()}>{children}</View>
        </ScrollView>
      ) : (
        <View className={`flex-1 bg-app-bg px-5 ${withBottomSpace ? 'pb-6' : ''} ${contentClassName}`.trim()}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}
