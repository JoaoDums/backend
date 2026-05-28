const pool = require("../database");

async function getTasks(req, res) {

  const result = await pool.query(
    "SELECT * FROM tasks ORDER BY id DESC"
  );

  res.json(result.rows);
}

async function createTask(req, res) {

  const { title, description } = req.body;

  const result = await pool.query(

    `
      INSERT INTO tasks (
        title,
        description
      )
      VALUES ($1, $2)
      RETURNING *
    `,

    [title, description]

  );

  res.status(201).json(
    result.rows[0]
  );
}

async function deleteTask(req, res) {

  const { id } = req.params;

  await pool.query(
    "DELETE FROM tasks WHERE id = $1",
    [id]
  );

  res.sendStatus(204);
}

async function updateTask(req, res) {

  const { id } = req.params;

  const { done } = req.body;

  const result = await pool.query(

    `
      UPDATE tasks
      SET done = $1
      WHERE id = $2
      RETURNING *
    `,

    [done, id]

  );

  res.json(result.rows[0]);
}

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask
};