import express from "express";
import { authMiddleware } from "../index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  changeUserPassword,
} from "../controllers/adminController.js";

const router = express.Router();

// Проверка доступа
router.get("/ping", authMiddleware, requireAdmin, (req, res) => {
  res.json({ ok: true });
});

// Получить всех пользователей
router.get("/users", authMiddleware, requireAdmin, getAllUsers);

// Смена роли
router.patch("/users/:id/role", authMiddleware, requireAdmin, updateUserRole);

// Смена статуса
router.patch("/users/:id/status", authMiddleware, requireAdmin, updateUserStatus);

// Смена пароля (БЕЗ показа!)
router.patch("/users/:id/password", authMiddleware, requireAdmin, changeUserPassword);

export default router;
