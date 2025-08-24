# Book Lending Tracker

A modern, responsive web application to track your personal library and book lending activities.

## Features
- Add, edit, and manage books (title, author, genre, ISBN, description, cover image, tags)
- Manage friends (name, contact info)
- Lend and return books with dates and condition notes
- Dashboard with stats: total books, lent out, available, overdue
- Search and filter books by title, author, status
- Lending history for each book and friend
- Overdue tracking and reminders
- Export/import data for backup
- Statistics and charts
- Dark/light theme toggle
- Print-friendly lending receipts
- Bulk import books from CSV

## Tech Stack
- Next.js (React, TypeScript)
- Shadcn UI (Tailwind CSS)
- MongoDB (local, via Docker)

## Getting Started
1. Start MongoDB locally:
   ```bash
   docker-compose up -d
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication
- Simple username/password login (to be implemented)

## Sample Data
- The app will include sample books and friends for demonstration.

## License
MIT
