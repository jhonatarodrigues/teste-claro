import { mockTeamRepository } from '../mock-team-repository';
import { mockTasks, mockTeams } from '../mock-db';

const initialTeams = mockTeams.map((team) => ({ ...team }));
const initialTasks = mockTasks.map((task) => ({ ...task, teamIds: [...task.teamIds] }));

function resetMockState() {
  mockTeams.splice(0, mockTeams.length, ...initialTeams.map((team) => ({ ...team })));
  mockTasks.splice(
    0,
    mockTasks.length,
    ...initialTasks.map((task) => ({ ...task, teamIds: [...task.teamIds] })),
  );
}

describe('mockTeamRepository', () => {
  beforeEach(() => {
    resetMockState();
  });

  it('updates an existing team', async () => {
    const response = await mockTeamRepository.update('team-2', {
      name: 'Growth Team',
      colorHex: '#FFAA00',
      description: 'Updated team description',
    });

    expect(response.data).toEqual({
      id: 'team-2',
      name: 'Growth Team',
      colorHex: '#FFAA00',
      description: 'Updated team description',
    });
    expect(mockTeams.find((team) => team.id === 'team-2')).toEqual(response.data);
  });

  it('removes a team and unlinks it from tasks without deleting tasks', async () => {
    const taskCountBefore = mockTasks.length;

    await mockTeamRepository.remove('team-1');

    expect(mockTeams.some((team) => team.id === 'team-1')).toBe(false);
    expect(mockTasks).toHaveLength(taskCountBefore);
    expect(mockTasks.every((task) => !task.teamIds.includes('team-1'))).toBe(true);
    expect(mockTasks.find((task) => task.id === 'task-4')?.teamIds).toEqual(['team-3']);
  });
});
