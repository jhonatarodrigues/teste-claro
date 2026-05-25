import { useState } from 'react';

import { TaskStatus } from '../types/task';

export function useTaskFilters(initialTeamId?: string) {
  const [teamId, setTeamId] = useState<string | undefined>(initialTeamId);
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [search, setSearch] = useState('');

  return {
    filters: {
      teamId,
      status,
      search,
      limit: 10,
      sort: 'status' as const,
    },
    teamId,
    status,
    search,
    setTeamId,
    setStatus,
    setSearch,
    reset() {
      setTeamId(undefined);
      setStatus(undefined);
      setSearch('');
    },
  };
}
