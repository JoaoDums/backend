const { Pool } = require("pg");

const pool = new Pool({

  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "Joao@1357",
  port: 5432

});

module.exports = pool;