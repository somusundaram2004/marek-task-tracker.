CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  due_date DATE,
  priority VARCHAR(10) NOT NULL CHECK (priority IN ('Low','Medium','High')),
  is_done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO tasks (title, description, due_date, priority, is_done)
VALUES
('Complete Project', 'Finish project work', '2026-06-20', 'High', FALSE),
('Prepare for Interview', 'Practice interview questions', '2026-06-19', 'High', FALSE),
('Practice Drawing', 'Complete drawing practice', '2026-06-21', 'Medium', FALSE),
('Read Book', 'Read 20 pages', '2026-06-22', 'Low', TRUE),
('Go for Walk', '30 minutes walking', '2026-06-18', 'Low', TRUE);