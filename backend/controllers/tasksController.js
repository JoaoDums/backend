const pool = require("../database");

async function getTasks(req, res) {

  const userId = req.user.id;

  const result = await pool.query(

    `
      SELECT *
      FROM tasks
      WHERE user_id = $1
      ORDER BY id DESC
    `,

    [userId]

  );

  res.json(result.rows);
}

async function createTask(req, res) {
  const { title, description } = req.body;
  const userId = req.user.id;
  if (!title) {
    return res.status(400).json({
      message: "Título é obrigatório"
    });
  }

  const result = await pool.query(

    `
  INSERT INTO tasks (
  title,
  description,
  user_id
)
VALUES ($1, $2, $3)
      RETURNING *
    `,

    [title, description, userId]

  );

  res.status(201).json(
    result.rows[0]
  );

}

async function deleteTask(req, res) {

  const { id } = req.params;

  const userId = req.user.id;

  const task = await pool.query(

    `
      SELECT *
      FROM tasks
      WHERE id = $1
    `,

    [id]

  );

  if (task.rows.length === 0) {

    return res.status(404).json({
      message: "Tarefa não encontrada"
    });

  }

  if (task.rows[0].user_id !== userId) {

    return res.status(403).json({
      message: "Você não tem permissão para excluir esta tarefa"
    });

  }

  await pool.query(

    `
      DELETE FROM tasks
      WHERE id = $1
    `,

    [id]

  );

  res.sendStatus(204);
}

async function updateTask(req, res) {

  const { id } = req.params;

  const { done } = req.body;

  const userId = req.user.id;

  const task = await pool.query(

    `
      SELECT *
      FROM tasks
      WHERE id = $1
    `,

    [id]

  );

  if (task.rows.length === 0) {

    return res.status(404).json({
      message: "Tarefa não encontrada"
    });

  }

  if (task.rows[0].user_id !== userId) {

    return res.status(403).json({
      message: "Você não tem permissão para alterar esta tarefa"
    });

  }

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