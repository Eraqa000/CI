import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool, testDbConnection } from "./db.js";
import oreSamplesRoutes from "./routes/oreSamplesRoutes.js";
import { computeTask1 } from "./controllers/task1Controller.js";
import task1MlRoutes from "./routes/task1MlRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());

app.use(express.json());




function signToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  return token;
}


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Нет токена авторизации" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Неверный или просроченный токен" });
  }
}



app.get("/", (req, res) => {
  res.send("IMIO backend is running");
});

app.get("/api/health", async (req, res) => {
  try {
    const dbRes = await pool.query("SELECT NOW()");
    res.json({
      status: "ok",
      time: dbRes.rows[0].now,
    });
  } catch (err) {
    console.error("Health check error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});



app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, full_name, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }


    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Пользователь уже существует" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (email, password_hash, full_name, role, status)
      VALUES ($1, $2, $3, 'engineer', 'active')
      RETURNING id, email, full_name, role, status, created_at
    `;

    const result = await pool.query(insertQuery, [
      email,
      passwordHash,
      full_name,
    ]);

    const user = result.rows[0];
    const token = signToken(user);

    res.status(201).json({ token, user });
  } catch (err) {
    console.error("POST /api/auth/register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    const token = signToken(user);
    delete user.password_hash; 

    res.json({ token, user });
  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, full_name, role, status, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET /api/auth/me error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/api/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Недостаточно прав" });
    }

    const result = await pool.query(
      "SELECT id, email, full_name, role, status, created_at FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/users error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.use("/api/task1/samples", authMiddleware, oreSamplesRoutes);
app.use("/api/task1", authMiddleware, task1MlRoutes);
// Вычисления для первой задачи
app.post("/api/task1/compute", authMiddleware, computeTask1);


app.listen(PORT, async () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  await testDbConnection();
});
