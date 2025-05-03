// Simple script to seed the database with initial data
const sqlite3 = require('sqlite3').verbose();
const { randomUUID } = require('crypto');
const path = require('path');

const dbPath = path.join(process.cwd(), 'sqlite.db');
const db = new sqlite3.Database(dbPath);

// Run the script
async function main() {
  return new Promise((resolve, reject) => {
    // Begin transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // Create a board
      const boardId = randomUUID();
      db.run(
        'INSERT INTO boards (id, title) VALUES (?, ?)',
        [boardId, 'My First Board'],
        function (err) {
          if (err) {
            db.run('ROLLBACK');
            reject(err);
            return;
          }
          
          console.log(`Created board with ID: ${boardId}`);
          
          // Create lists
          const todoId = randomUUID();
          const inProgressId = randomUUID();
          const doneId = randomUUID();
          
          db.run(
            'INSERT INTO lists (id, title, order, board_id) VALUES (?, ?, ?, ?)',
            [todoId, 'To Do', 0, boardId]
          );
          
          db.run(
            'INSERT INTO lists (id, title, order, board_id) VALUES (?, ?, ?, ?)',
            [inProgressId, 'In Progress', 1, boardId]
          );
          
          db.run(
            'INSERT INTO lists (id, title, order, board_id) VALUES (?, ?, ?, ?)',
            [doneId, 'Done', 2, boardId]
          );
          
          // Create cards
          db.run(
            'INSERT INTO cards (id, title, description, order, list_id) VALUES (?, ?, ?, ?, ?)',
            [randomUUID(), 'Research user requirements', 'Conduct user interviews and gather requirements', 0, todoId]
          );
          
          db.run(
            'INSERT INTO cards (id, title, description, order, list_id) VALUES (?, ?, ?, ?, ?)',
            [randomUUID(), 'Create wireframes', 'Design initial wireframes for the application', 1, todoId]
          );
          
          db.run(
            'INSERT INTO cards (id, title, description, order, list_id) VALUES (?, ?, ?, ?, ?)',
            [randomUUID(), 'Implement authentication', 'Set up user authentication with JWT', 0, inProgressId]
          );
          
          db.run(
            'INSERT INTO cards (id, title, description, order, list_id) VALUES (?, ?, ?, ?, ?)',
            [randomUUID(), 'Project setup', 'Initialize the project with Next.js and Tailwind CSS', 0, doneId],
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                reject(err);
                return;
              }
              
              // Commit the transaction
              db.run('COMMIT', (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                console.log('Seed completed successfully');
                resolve();
              });
            }
          );
        }
      );
    });
  });
}

// Execute the main function
main()
  .then(() => {
    db.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed error:', error);
    db.close();
    process.exit(1);
  });
