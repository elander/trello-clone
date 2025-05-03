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

    // Create a board
    const boardId = randomUUID();
    db.prepare(
      'INSERT INTO boards (id, title, created_at, updated_at) VALUES (?, ?, strftime("%s", "now"), strftime("%s", "now"))'
    ).run(boardId, 'My First Board');
    
    console.log(`Created board with ID: ${boardId}`);
    
    // Create lists
    const todoId = randomUUID();
    const inProgressId = randomUUID();
    const doneId = randomUUID();
    
    db.prepare(
      'INSERT INTO lists (id, title, order, board_id, created_at, updated_at) VALUES (?, ?, ?, ?, strftime("%s", "now"), strftime("%s", "now"))'
    ).run(todoId, 'To Do', 0, boardId);
    
    db.prepare(
      'INSERT INTO lists (id, title, order, board_id, created_at, updated_at) VALUES (?, ?, ?, ?, strftime("%s", "now"), strftime("%s", "now"))'
    ).run(inProgressId, 'In Progress', 1, boardId);
    
    db.prepare(
      'INSERT INTO lists (id, title, order, board_id, created_at, updated_at) VALUES (?, ?, ?, ?, strftime("%s", "now"), strftime("%s", "now"))'
    ).run(doneId, 'Done', 2, boardId);
    
    // Create cards
    db.prepare(
      'INSERT INTO cards (id, title, description, order, list_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, strftime("%s", "now"), strftime("%s", "now"))'
    ).run(randomUUID(), 'Research user requirements', 'Conduct user interviews and gather requirements', 0, todoId);
    
    db.prepare(
      'INSERT INTO cards (id, title, description, order, list_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, strftime("%s", "now"), strftime("%s", "now"))'
    ).run(randomUUID(), 'Create wireframes', 'Design initial wireframes for the application', 1, todoId);
    
    db.prepare(
      'INSERT INTO cards (id, title, description, order, list_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, strftime("%s", "now"), strftime("%s", "now"))'
    ).run(randomUUID(), 'Implement authentication', 'Set up user authentication with JWT', 0, inProgressId);
    
    db.prepare(
      'INSERT INTO cards (id, title, description, order, list_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, strftime("%s", "now"), strftime("%s", "now"))'
    ).run(randomUUID(), 'Project setup', 'Initialize the project with Next.js and Tailwind CSS', 0, doneId);
    
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
