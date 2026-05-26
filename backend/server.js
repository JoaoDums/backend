const express = require("express");
const cors = require("cors");

const app = express();

/*
  Permite comunicação frontend/backend
*/
app.use(cors());

/*
  Permite receber JSON
*/
app.use(express.json());

/*
  Array de tarefas
*/
let tasks = [];

/*
  Rota inicial
*/
app.get("/", (req, res) => {
  res.send("API funcionando");
});

/*
  Listar tarefas
*/
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

/*
  Criar tarefa
*/
app.post("/tasks", (req, res) => {

  const newTask = {
    id: Date.now(),

    title: req.body.title,

    description: req.body.description,

    done: false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

/*
  Deletar tarefa
*/
app.delete("/tasks/:id", (req, res) => {

  const taskId = Number(req.params.id);

  tasks = tasks.filter(
    task => task.id !== taskId
  );

  res.json({
    message: "Tarefa removida"
  });
});

/*
  Atualizar tarefa
*/
app.put("/tasks/:id", (req, res) => {

  const taskId = Number(req.params.id);

  const task = tasks.find(
    task => task.id === taskId
  );

  if (!task) {
    return res.status(404).json({
      message: "Tarefa não encontrada"
    });
  }

  task.done = req.body.done;

  res.json(task);
});

/*
  Iniciar servidor
*/
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});