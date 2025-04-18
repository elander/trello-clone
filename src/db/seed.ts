import { getDb, schema } from '.';

async function seed() {
  const db = getDb();
  
  // Create a sample board
  const [board] = await db.insert(schema.boards).values({
    title: 'My First Project',
  }).returning();
  
  // Create sample lists
  const [todoList] = await db.insert(schema.lists).values({
    title: 'To Do',
    order: 0,
    boardId: board.id,
  }).returning();
  
  const [inProgressList] = await db.insert(schema.lists).values({
    title: 'In Progress',
    order: 1,
    boardId: board.id,
  }).returning();
  
  const [doneList] = await db.insert(schema.lists).values({
    title: 'Done',
    order: 2,
    boardId: board.id,
  }).returning();
  
  // Create sample cards
  await db.insert(schema.cards).values([
    {
      title: 'Research user requirements',
      description: 'Conduct user interviews and gather requirements',
      order: 0,
      listId: todoList.id,
    },
    {
      title: 'Create wireframes',
      description: 'Design initial wireframes for the application',
      order: 1,
      listId: todoList.id,
    },
    {
      title: 'Implement authentication',
      description: 'Set up user authentication with JWT',
      order: 0,
      listId: inProgressList.id,
    },
    {
      title: 'Project setup',
      description: 'Initialize the project with Next.js and Tailwind CSS',
      order: 0,
      listId: doneList.id,
    },
  ]);
  
  console.log('Seed completed successfully');
  console.log(`Created board with ID: ${board.id}`);
}

seed().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});
