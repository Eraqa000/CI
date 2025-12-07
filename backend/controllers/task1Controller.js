// backend/controllers/task1Controller.js
import { pool } from "../db.js";

export async function computeTask1(req, res) {
  try {
    const userId = req.user.id;
    const { ore_ids } = req.body;

    let query;
    let params;

    if (Array.isArray(ore_ids) && ore_ids.length > 0) {
      query = `
        SELECT *
        FROM ore_samples
        WHERE user_id = $1 AND id = ANY($2::bigint[])
        ORDER BY id
      `;
      params = [userId, ore_ids];
    } else {
      // если ids не передали — считаем по всем рудам пользователя
      query = `
        SELECT *
        FROM ore_samples
        WHERE user_id = $1
        ORDER BY id
      `;
      params = [userId];
    }

    const { rows: samples } = await pool.query(query, params);

    if (samples.length === 0) {
      return res
        .status(400)
        .json({ message: "Нет руд для расчёта у этого пользователя" });
    }

    // Простая заглушка-«инженерный» расчёт
    const results = samples.map((s) => {
      const cao = Number(s.cao_pct ?? 0);
      const al2o3 = Number(s.al2o3_pct ?? 0);
      const sio2 = Number(s.sio2_pct ?? 0);
      const sPct = Number(s.s_pct ?? 0);

      let slag_basicity = null;
      if (sio2 > 0) {
        slag_basicity = Number(((cao + al2o3) / sio2).toFixed(3));
      }

      return {
        sample_id: s.id,
        sample_name: s.sample_name,
        slag_basicity,
        sulphur_load: sPct, // пока просто S, %
      };
    });

    return res.json({ samples, results });
  } catch (err) {
    console.error("computeTask1 error:", err);
    return res
      .status(500)
      .json({ message: "Ошибка вычисления", detail: err.message });
  }
}
