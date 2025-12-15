import bcrypt from "bcrypt";
import { pool } from "../db.js";

// Получить всех пользователей
export async function getAllUsers(req, res) {
  const { rows } = await pool.query(`
    SELECT id, full_name, email, role, status, created_at
    FROM users
    ORDER BY id ASC
  `);

  res.json(rows);
}

// Изменить роль
export async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  await pool.query(
    "UPDATE users SET role = $1 WHERE id = $2",
    [role, id]
  );

  res.json({ success: true });
}

// Изменить статус
export async function updateUserStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  await pool.query(
    "UPDATE users SET status = $1 WHERE id = $2",
    [status, id]
  );

  res.json({ success: true });
}

// Смена пароля (БЕЗ возврата!)
export async function changeUserPassword(req, res) {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Пароль минимум 6 символов" });
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await pool.query(
    "UPDATE users SET password_hash = $1 WHERE id = $2",
    [hash, id]
  );

  res.json({ success: true });
}
