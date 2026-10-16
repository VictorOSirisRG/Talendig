import bcrytp from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/sqlserver.js";

//Post /api/auth/registro

export async function registro(req, res) {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Por favor, complete todos los campos" });
  }

  const hash = await bcrytp.hash(password, 10);
  const r= await pool.request()
    .input("nombre", nombre)
    .input("email", email)
    .input("hash", hash)
    .query("INSERT INTO usuarios (nombre, email, hash) Output inserted.id,inserted.nombre,inserted.email VALUES (@nombre, @email, @hash)");
    res.status(201).json(r.recordset[0]);
}


//Post /api/auth/login
export async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Por favor, complete todos los campos" });
    }
    const r = await pool.request()
      .input("email", email)
      .query("SELECT * FROM usuarios WHERE email = @email");
    const usuario = r.recordset[0];

    const ok = usuario && await bcrytp.compare(password, usuario.hash);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const {id,nombre} = usuario;
    const token = jwt.sign({  id,nombre }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, nombre });

}