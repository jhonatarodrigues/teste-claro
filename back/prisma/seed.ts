import { PrismaClient, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.taskTeam.deleteMany();
  await prisma.task.deleteMany();
  await prisma.team.deleteMany();

  const teams = await prisma.$transaction([
    prisma.team.create({
      data: {
        name: 'Marketing',
        colorHex: '#F97316',
        description: 'Campaigns and communication',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Product',
        colorHex: '#2563EB',
        description: 'Discovery and roadmap',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Engineering',
        colorHex: '#16A34A',
        description: 'Technical delivery',
      },
    }),
  ]);

  const [marketing, product, engineering] = teams;

  const tasks = [
    { title: 'Define campaign briefing', status: TaskStatus.Pendente, teamIds: [marketing.id] },
    { title: 'Review onboarding flow', status: TaskStatus.Em_Progresso, teamIds: [product.id, engineering.id] },
    { title: 'Publish initial documentation', status: TaskStatus.Concluida, teamIds: [] },
    { title: 'Prepare release notes', status: TaskStatus.Pendente, teamIds: [product.id] },
    { title: 'Update analytics dashboard', status: TaskStatus.Em_Progresso, teamIds: [marketing.id, product.id] },
    { title: 'Fix API pagination', status: TaskStatus.Pendente, teamIds: [engineering.id] },
    { title: 'Map user feedback themes', status: TaskStatus.Concluida, teamIds: [product.id] },
    { title: 'Refine support FAQ', status: TaskStatus.Pendente, teamIds: [marketing.id] },
    { title: 'Stabilize background jobs', status: TaskStatus.Em_Progresso, teamIds: [engineering.id] },
    { title: 'Validate launch checklist', status: TaskStatus.Concluida, teamIds: [marketing.id, engineering.id] }
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        title: task.title,
        status: task.status,
        teamLinks: {
          create: task.teamIds.map((teamId) => ({ teamId })),
        },
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
