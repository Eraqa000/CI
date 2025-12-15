import { pool } from "../db.js";

// 1) Создание job
export async function createJob(req, res) {
  try {
    const userId = req.user.id;
    const { task_type } = req.body;

    const query = `
      INSERT INTO jobs (user_id, task_type, status, started_at)
      VALUES ($1, $2, 'running', NOW())
      RETURNING *
    `;

    const job = await pool.query(query, [userId, task_type]);
    res.json(job.rows[0]);
  } catch (err) {
    console.error("createJob error:", err);
    res.status(500).json({ message: "Ошибка создания job" });
  }
}


// 2) Сохранение входных данных
export async function saveJobInput(req, res) {
  try {
    const { job_id, payload } = req.body;

    const result = await pool.query(
      `INSERT INTO job_inputs (job_id, payload)
       VALUES ($1, $2)
       RETURNING *`,
      [job_id, payload]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("saveJobInput error:", err);
    res.status(500).json({ message: "Ошибка сохранения входных данных" });
  }
}


// 3) Сохранение результата
export async function saveJobResult(req, res) {
  try {
    const { job_id, result_type, payload } = req.body;

    const result = await pool.query(
      `INSERT INTO job_results (job_id, result_type, payload)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [job_id, result_type, payload]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("saveJobResult error:", err);
    res.status(500).json({ message: "Ошибка сохранения результата" });
  }
}


// 4) Получение всех результатов пользователя
export async function listJobResults(req, res) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT r.*, j.task_type
       FROM job_results r
       INNER JOIN jobs j ON r.job_id = j.id
       WHERE j.user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("listJobResults error:", err);
    res.status(500).json({ message: "Ошибка загрузки результатов" });
  }
}

export async function deleteJobResult(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Удаляем только если job принадлежит пользователю
    const query = `
      DELETE FROM job_results
      WHERE id = $1
      AND job_id IN (
        SELECT id FROM jobs WHERE user_id = $2
      )
    `;

    await pool.query(query, [id, userId]);
    res.json({ success: true });

  } catch (err) {
    console.error("deleteJobResult error:", err);
    res.status(500).json({ message: "Ошибка удаления результата" });
  }
}

 