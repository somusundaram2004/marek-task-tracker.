const express = require('express');
const router = express.Router();

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
} = require('../controllers/taskController');

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.patch('/:id/toggle', toggleTaskStatus);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
