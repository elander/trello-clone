// Simple script to seed the database with initial data
const Database = require('better-sqlite3');
const { randomUUID } = require('crypto');
const path = require('path');

const dbPath = path.join(process.cwd(), 'sqlite.db');
const db = new Database(dbPath);

// Run the script
async function main() {
  try {
    // Begin transaction
    db.prepare('BEGIN TRANSACTION').run();

    // Get current timestamp
    const now = Math.floor(Date.now() / 1000);

    // Create a board
    const boardId = randomUUID();
    db.prepare(
      'INSERT INTO boards (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)'
    ).run(boardId, 'My First Board', now, now);
    
    console.log(`Created board with ID: ${boardId}`);
    
    // Create lists
    const todoId = randomUUID();
    const inProgressId = randomUUID();
    const doneId = randomUUID();
    
    db.prepare(
      'INSERT INTO lists (id, title, "order", board_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(todoId, 'To Do', 0, boardId, now, now);
    
    db.prepare(
      'INSERT INTO lists (id, title, "order", board_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(inProgressId, 'In Progress', 1, boardId, now, now);
    
    db.prepare(
      'INSERT INTO lists (id, title, "order", board_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(doneId, 'Done', 2, boardId, now, now);
    
    // Create cards
    db.prepare(
      'INSERT INTO cards (id, title, description, "order", list_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(randomUUID(), 'Research user requirements', 'Conduct user interviews and gather requirements', 0, todoId, now, now);
    
    db.prepare(
      'INSERT INTO cards (id, title, description, "order", list_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(randomUUID(), 'Create wireframes', 'Design initial wireframes for the application', 1, todoId, now, now);
    
    db.prepare(
      'INSERT INTO cards (id, title, description, "order", list_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(randomUUID(), 'Implement authentication', 'Set up user authentication with JWT', 0, inProgressId, now, now);
    
    db.prepare(
      'INSERT INTO cards (id, title, description, "order", list_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(randomUUID(), 'Project setup', 'Initialize the project with Next.js and Tailwind CSS', 0, doneId, now, now);
    
    // Commit the transaction
    db.prepare('COMMIT').run();
    
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    db.prepare('ROLLBACK').run();
    throw error;
  } finally {
    db.close();
  }
}

// Execute the main function
main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  });
