const express = require("express");
const cors = require("cors");

const tasksRoutes = require("./routes/tasksRoutes");
const loggerMiddleware = require("./middlewares/loggerMiddleware");
const app = express();

app.use(cors());

app.use(loggerMiddleware);

app.use(express.json());

app.use(tasksRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando");
});