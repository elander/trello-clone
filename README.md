# Trello Clone

A fully functional Trello clone built with:
- Next.js 14
- React 18
- shadcn/ui components
- Tailwind CSS
- SQLite database (for local development)
- Drizzle ORM
- React Context API for state management

## Features
- Drag and drop kanban board
- Create, edit, and delete cards
- Create and manage lists
- Dark mode support
- Responsive design

## Getting Started

1. Clone this repository
   ```bash
   git clone https://github.com/elander/trello-clone.git
   cd trello-clone
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up the database with Drizzle
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. Seed the database with initial data (optional)
   ```bash
   node -r esbuild-register src/db/seed.ts
   ```

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Structure

This project uses SQLite for local development with Drizzle as the ORM. The database schema includes:

- `Board`: Container for lists
- `List`: Container for cards within a board
- `Card`: Individual task/item within a list

## Technical Details

### Frontend
- **React and Next.js**: For rendering the UI and handling routing
- **@hello-pangea/dnd**: For drag and drop functionality
- **React Context API**: For state management
- **shadcn/ui**: For UI components
- **Tailwind CSS**: For styling

### Backend
- **Next.js API Routes**: For handling API requests
- **Drizzle ORM**: For database operations and schema definition
- **SQLite (better-sqlite3)**: For local database storage

### State Management
- **React Context API**: Used for global state management
  - `CardModalContext`: Manages the state of the card modal
  - `BoardContext`: Manages the state of lists and cards on the board

## License

MIT
