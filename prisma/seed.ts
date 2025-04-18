import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a sample board
  const board = await prisma.board.create({
    data: {
      title: 'My First Project',
      lists: {
        create: [
          {
            title: 'To Do',
            order: 0,
            cards: {
              create: [
                {
                  title: 'Research user requirements',
                  description: 'Conduct user interviews and gather requirements',
                  order: 0,
                },
                {
                  title: 'Create wireframes',
                  description: 'Design initial wireframes for the application',
                  order: 1,
                },
              ],
            },
          },
          {
            title: 'In Progress',
            order: 1,
            cards: {
              create: [
                {
                  title: 'Implement authentication',
                  description: 'Set up user authentication with JWT',
                  order: 0,
                },
              ],
            },
          },
          {
            title: 'Done',
            order: 2,
            cards: {
              create: [
                {
                  title: 'Project setup',
                  description: 'Initialize the project with Next.js and Tailwind CSS',
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seed completed successfully');
  console.log(`Created board with ID: ${board.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
