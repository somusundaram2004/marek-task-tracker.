const pool = require('../db/db');

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['pending', 'done'];

const isValidId = (id) => {
  const taskId = Number(id);
  return Number.isInteger(taskId) && taskId > 0;
};

const isValidPriority = (priority) => VALID_PRIORITIES.includes(priority);

const isValidDate = (date) => {
  if (date === undefined || date === null || date === '') {
    return true;
  }

  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().startsWith(date);
};

const validateTaskInput = (task, requireIsDone = false) => {
  const { title, description, due_date, priority, is_done } = task;

  if (typeof title !== 'string' || title.trim() === '') {
    return 'Title is required';
  }

  if (title.trim().length > 200) {
    return 'Title must be 200 characters or less';
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    return 'Description must be text';
  }

  if (!isValidDate(due_date)) {
    return 'Due date must be a valid date in YYYY-MM-DD format';
  }

  if (!isValidPriority(priority)) {
    return 'Priority must be Low, Medium, or High';
  }

  if (requireIsDone && typeof is_done !== 'boolean') {
    return 'Task status must be true or false';
  }

  return null;
};

const getTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;

    if (status && status !== 'All' && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Status must be pending or done' });
    }

    if (priority && priority !== 'All' && !isValidPriority(priority)) {
      return res.status(400).json({ message: 'Priority must be Low, Medium, or High' });
    }

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
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

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
    const body = req.body || {};
    const task = {
      ...body,
      priority: body.priority || 'Medium'
    };
    const { title, description, due_date, priority } = task;

    const validationError = validateTaskInput(task);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, due_date, priority)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title.trim(), description || null, due_date || null, priority]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

const updateTask = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const body = req.body || {};
    const { title, description, due_date, priority, is_done } = body;
    const validationError = validateTaskInput(body, true);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           due_date = $3,
           priority = $4,
           is_done = $5
       WHERE id = $6
       RETURNING *`,
      [title.trim(), description || null, due_date || null, priority, is_done, req.params.id]
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
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

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

const toggleTaskStatus = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const result = await pool.query(
      `UPDATE tasks
       SET is_done = NOT is_done
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task status' });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
};
