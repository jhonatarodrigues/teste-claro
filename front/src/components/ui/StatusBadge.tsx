import { Text, View } from 'react-native';

import { TaskStatus } from '../../types/task';

const styles: Record<TaskStatus, string> = {
  Pendente: 'bg-[#d9480f]',
  'Em Progresso': 'bg-[#c2a313]',
  Concluida: 'bg-[#7cb518]',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <View className={`rounded-full px-3 py-1 ${styles[status]}`}>
      <Text className="text-[10px] font-semibold uppercase tracking-[0.4px] text-white">
        {status.toLowerCase()}
      </Text>
    </View>
  );
}
