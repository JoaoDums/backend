const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

const {
  getTasks,
  createTask,
  deleteTask,
  updateTask, 
  
} = require("../controllers/tasksController");

router.get(
  "/tasks",
  authMiddleware,
  getTasks
);

router.post(
  "/tasks",
  authMiddleware,
  createTask
);

router.delete(
  "/tasks/:id",
  authMiddleware,
  deleteTask
);

router.put(
  "/tasks/:id",
  authMiddleware,
  updateTask
);

module.exports = router;