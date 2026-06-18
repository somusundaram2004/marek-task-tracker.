const pool = require('../db/db');

const getTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;

    let query = 'SELECT * FROM tasks';
    const values = [];
    const conditions = [];

    if (status === 'pending') {
      conditions.push('is_done = false');
    }

    if (status === 'done') {
      conditions.push('is_done = true');
    }

    if (priority && priority !== 'All') {
      values.push(priority);
      conditions.push(`priority = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY due_date ASC NULLS LAST';

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result.rows[0]);
 } catch (error) {
  console.log(error);
  res.status(500).json({ message: 'Error fetching tasks' });
}
};

const createTask = async (req, res) => {
  try {
    const { title, description, due_date, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, due_date, priority)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description || null, due_date || null, priority || 'Medium']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, due_date, priority, is_done } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           due_date = $3,
           priority = $4,
           is_done = $5
       WHERE id = $6
       RETURNING *`,
      [title, description, due_date || null, priority, is_done, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
