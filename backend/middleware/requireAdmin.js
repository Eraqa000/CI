// backend/middleware/requireAdmin.js
export function requireAdmin(req, res, next) {
  // authMiddleware УЖЕ отработал
  // req.user гарантированно есть
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  // подстрой под реальные поля в БД
  const isAdmin =
    user.role === "admin" ||
    user.status === "admin";

  if (!isAdmin) {
    return res.status(403).json({ message: "Доступ только для администратора" });
  }

  next();
}
