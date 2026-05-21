import { Team } from '../../types/team';
import { Task } from '../../types/task';

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Time A',
    colorHex: '#8BFF3D',
    description: 'Operacao principal',
  },
  {
    id: 'team-2',
    name: 'Time B',
    colorHex: '#B59A15',
    description: 'Planejamento e apoio',
  },
  {
    id: 'team-3',
    name: 'Time C',
    colorHex: '#22D3EE',
    description: 'Entrega e execucao',
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Título da tarefa',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ullamcorper vehicula diam. In faucibus, augue eget viverra euismod, magna nibh vestibulum mi, a dictum mi nulla in nulla.',
    status: 'Pendente',
    teamIds: ['team-1'],
  },
  {
    id: 'task-2',
    title: 'Título da tarefa',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ullamcorper vehicula diam. In faucibus, augue eget viverra euismod, magna nibh vestibulum mi, a dictum mi nulla in nulla.',
    status: 'Em Progresso',
    teamIds: ['team-2'],
  },
  {
    id: 'task-3',
    title: 'Título da tarefa',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ullamcorper vehicula diam. In faucibus, augue eget viverra euismod, magna nibh vestibulum mi, a dictum mi nulla in nulla.',
    status: 'Concluida',
    teamIds: ['team-3'],
  },
  {
    id: 'task-4',
    title: 'Atualizar card de consumo',
    description: 'Revisar layout, copy e espaçamento do card principal da home.',
    status: 'Pendente',
    teamIds: ['team-1', 'team-3'],
  },
];

export function createId(prefix: 'team' | 'task') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
