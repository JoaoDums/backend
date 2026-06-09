const pool = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "minha_chave_super_secreta";
async function register(req, res) {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email e senha são obrigatórios"
    });
  }

  const userExists = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (userExists.rows.length > 0) {
    return res.status(400).json({
      message: "Usuário já existe"
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  const result = await pool.query(
    `
      INSERT INTO users (
        email,
        password
      )
      VALUES ($1, $2)
      RETURNING id, email
    `,
    [email, hashedPassword]
  );

  res.status(201).json(
    result.rows[0]
  );
}

async function login(req, res) {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email e senha são obrigatórios"
    });
  }

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
    
  );


  if (result.rows.length === 0) {
    return res.status(401).json({
      message: "Email ou senha inválidos"
    });
  }

  const user = result.rows[0];

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Email ou senha inválidos"
    });
  }

 const token = jwt.sign(
  {
    id: user.id,
    email: user.email
  },
  JWT_SECRET,
  {
    expiresIn: "1h"
  }
);

res.json({
  message: "Login realizado com sucesso",
  token
});
}

module.exports = {
  register,
  login
};