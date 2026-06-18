# Marek Task Tracker

Marek Task Tracker is a full-stack task management application built for an assignment submission. It uses an Angular frontend, a Node.js + Express REST API backend, and a PostgreSQL database for persistent task storage.

The application allows users to create tasks, view all tasks, mark tasks as done or pending, delete tasks, filter tasks by status and priority, and view task statistics.

## Project Overview

This project demonstrates a complete basic CRUD workflow using a real database-backed REST API and an Angular standalone frontend.

The system is divided into three main parts:

- Angular frontend for the user interface
- Express backend for REST API endpoints
- PostgreSQL database for persistent task data

## Assignment Requirement Mapping

| Requirement | Implementation Status |
|---|---|
| Angular frontend | Implemented |
| Node.js REST API | Implemented |
| PostgreSQL database | Implemented |
| CRUD operations | Implemented for create, read, delete, and backend update |
| Task filtering | Implemented with status and priority filters |
| Status updates | Implemented using a dedicated PATCH endpoint |
| Meaningful Git commits | Implemented with feature-based commits |
| README documentation | Provided in this file |

## Features

- View all tasks
- Create new tasks
- Delete tasks
- Mark tasks as done
- Mark tasks as pending
- Filter tasks by status:
  - All
  - Pending
  - Done
- Filter tasks by priority:
  - All
  - Low
  - Medium
  - High
- Combined filtering by status and priority
- Task statistics:
  - Total Tasks
  - Pending Tasks
  - Completed Tasks
- PostgreSQL data persistence
- REST API backend
- Angular standalone frontend
- Backend validation for task input

## Technology Stack

### Frontend

- Angular
- TypeScript
- Angular Forms
- Angular HttpClient

### Backend

- Node.js
- Express.js
- pg PostgreSQL client
- dotenv
- CORS

### Database

- PostgreSQL

### Version Control

- Git
- GitHub

## Project Structure

```text
Marek-Task-Tracker/
|-- backend/
|   |-- controllers/
|   |   `-- taskController.js
|   |-- db/
|   |   |-- db.js
|   |   `-- schema.sql
|   |-- routes/
|   |   `-- taskRoutes.js
|   |-- package.json
|   `-- server.js
|
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |   |-- models/
|   |   |   |   `-- task.model.ts
|   |   |   |-- services/
|   |   |   |   `-- task.service.ts
|   |   |   |-- app.config.ts
|   |   |   |-- app.html
|   |   |   |-- app.spec.ts
|   |   |   `-- app.ts
|   |   |-- index.html
|   |   `-- main.ts
|   |-- angular.json
|   `-- package.json
|
|-- .gitignore
`-- README.md
```

## Database Schema

The application uses a single table named `tasks`.

### tasks Table

| Column | Type | Description |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` | Unique task identifier |
| `title` | `VARCHAR(200) NOT NULL` | Task title |
| `description` | `TEXT` | Optional task description |
| `due_date` | `DATE` | Optional task due date |
| `priority` | `VARCHAR(10) NOT NULL` | Task priority: Low, Medium, or High |
| `is_done` | `BOOLEAN NOT NULL DEFAULT FALSE` | Task status |
| `created_at` | `TIMESTAMP NOT NULL DEFAULT NOW()` | Task creation timestamp |

### Database Creation SQL

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  due_date DATE,
  priority VARCHAR(10) NOT NULL CHECK (priority IN ('Low','Medium','High')),
  is_done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Sample Data

```sql
INSERT INTO tasks (title, description, due_date, priority, is_done)
VALUES
('Complete Project', 'Finish project work', '2026-06-20', 'High', FALSE),
('Prepare for Interview', 'Practice interview questions', '2026-06-19', 'High', FALSE),
('Practice Drawing', 'Complete drawing practice', '2026-06-21', 'Medium', FALSE),
('Read Book', 'Read 20 pages', '2026-06-22', 'Low', TRUE),
('Go for Walk', '30 minutes walking', '2026-06-18', 'Low', TRUE);
```

## API Endpoints

Base URL:

```text
http://localhost:5000/api/tasks
```

### GET /api/tasks

Fetch all tasks.

Optional query parameters:

```text
status=pending
status=done
priority=Low
priority=Medium
priority=High
```

Example:

```http
GET /api/tasks
```

### GET /api/tasks/:id

Fetch a single task by ID.

Example:

```http
GET /api/tasks/1
```

### POST /api/tasks

Create a new task.

Request body:

```json
{
  "title": "Submit assignment",
  "description": "Finish and submit the task tracker project",
  "due_date": "2026-06-20",
  "priority": "High"
}
```

### PUT /api/tasks/:id

Update an existing task.

Request body:

```json
{
  "title": "Submit assignment",
  "description": "Final review before submission",
  "due_date": "2026-06-20",
  "priority": "High",
  "is_done": false
}
```

### DELETE /api/tasks/:id

Delete a task by ID.

Example:

```http
DELETE /api/tasks/1
```

### PATCH /api/tasks/:id/toggle

Toggle task status between pending and done.

This endpoint updates only the `is_done` field and does not modify the due date.

Example:

```http
PATCH /api/tasks/1/toggle
```

## Installation Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Marek-Task-Tracker
```

Replace `<repository-url>` with the GitHub repository URL.

### 2. PostgreSQL Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE marek_task_tracker;
```

Connect to the database and run the schema:

```bash
psql -U postgres -d marek_task_tracker -f backend/db/schema.sql
```

You can also copy the SQL from the Database Schema section and run it manually in pgAdmin or psql.

### 3. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder.

Sample `.env` configuration:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=marek_task_tracker
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

Update the values based on your local PostgreSQL setup.

### 4. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

## Running the Application

### Start the Backend

From the `backend` folder:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

### Start the Frontend

From the `frontend` folder:

```bash
npm start
```

The frontend will run on:

```text
http://localhost:4200
```

Open the frontend URL in the browser to use the application.

## Screenshots

Add screenshots to this section before final submission.

### Home Page

```text
screenshots/home-page.png
```

### Add Task

```text
screenshots/add-task.png
```

### Task Filters

```text
screenshots/task-filters.png
```

### Database Table

```text
screenshots/database-table.png
```

## Assumptions Made

- The application runs locally during evaluation.
- The backend runs on port `5000`.
- The frontend runs on port `4200`.
- PostgreSQL is installed locally.
- The database credentials are provided through a backend `.env` file.
- Task priority values are limited to `Low`, `Medium`, and `High`.
- Task status is stored as a boolean using the `is_done` column.
- Due dates are stored in PostgreSQL using the `DATE` type.

## Challenges Faced

- Handling due dates safely while using PostgreSQL `DATE` values and Angular date inputs.
- Avoiding due date changes when toggling task status.
- Separating status toggle logic from full task update logic.
- Implementing combined filtering by status and priority.
- Keeping frontend task counters synchronized with the loaded task data.
- Improving backend validation so invalid input returns clear `400 Bad Request` responses.

## Future Improvements

- Add an edit task form in the Angular UI for full update support.
- Add pagination or search for larger task lists.
- Add authentication for personal task lists.
- Add backend unit tests and API integration tests.
- Add a backend `npm start` and `npm run dev` script.
- Add an `.env.example` file.
- Add deployment instructions.
- Improve UI styling with a design system or component library.
- Add screenshots directly into this README.

## Git Commit Summary

The project uses meaningful Git commits that follow the development progress:

```text
Initial project setup
Add PostgreSQL task schema and sample data
Connect backend to PostgreSQL database
Build REST API endpoint to retrieve tasks from database
Add Angular frontend source files to main repository
Add task creation form and save tasks to database
Implement task status updates and delete functionality
Fix task status toggle without changing due date
Add task filters and pending done counter
Add combined task filtering and statistics
Improve task API validation and frontend test
Use plain HTML table layout for tasks
```

## Testing and Verification

Frontend build:

```bash
cd frontend
npm run build
```

Frontend tests:

```bash
cd frontend
npm test -- --watch=false
```

Backend syntax checks:

```bash
node --check backend/server.js
node --check backend/routes/taskRoutes.js
node --check backend/controllers/taskController.js
```

## Conclusion

Marek Task Tracker satisfies the core assignment requirements by implementing an Angular frontend, a Node.js + Express REST API, and PostgreSQL database persistence. The project supports task creation, task listing, status updates, deletion, filtering, and task statistics. The backend uses structured REST endpoints, PostgreSQL queries, and validation to support reliable task management behavior.
