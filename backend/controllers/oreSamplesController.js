// backend/controllers/oreSamplesController.js
import { pool } from "../db.js";

export async function listOreSamples(req, res) {
  try {
    const userId = req.user.id; // берём из токена

    const query = `
      SELECT
        id,
        sample_name,
        cu_pct,
        fe_pct,
        s_pct,
        sio2_pct,
        cao_pct,
        al2o3_pct,
        as_pct,
        au_gpt,
        ag_gpt,
        extra_data,
        created_at,
        user_id
      FROM ore_samples
      WHERE user_id = $1
      ORDER BY id ASC
    `;

    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("listOreSamples error:", err);
    res.status(500).json({ message: "Ошибка загрузки руд" });
  }
}

export async function createOreSample(req, res) {
    try {
        const userId = req.user.id;
        const {
            sample_name,
            cu_pct,
            fe_pct,
            s_pct,
            sio2_pct,
            cao_pct,
            al2o3_pct,
            as_pct,
            au_gpt,
            ag_gpt,
            extra_data = null,
        } = req.body;

        // ВАЖНО: 12 колонок  →  12 значений ($1..$12)
        const insertQuery = `
            INSERT INTO ore_samples (
                user_id,
                sample_name,
                cu_pct,
                fe_pct,
                s_pct,
                sio2_pct,
                cao_pct,
                al2o3_pct,
                as_pct,
                au_gpt,
                ag_gpt,
                extra_data
            )
            VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12
            )
            RETURNING
                id,
                sample_name,
                cu_pct,
                fe_pct,
                s_pct,
                sio2_pct,
                cao_pct,
                al2o3_pct,
                as_pct,
                au_gpt,
                ag_gpt,
                extra_data,
                created_at,
                user_id
        `;

        const values = [
        userId,        // $1
        sample_name,   // $2
        cu_pct,        // $3
        fe_pct,        // $4
        s_pct,         // $5
        sio2_pct,      // $6
        cao_pct,       // $7
        al2o3_pct,     // $8
        as_pct,        // $9
        au_gpt,        // $10
        ag_gpt,        // $11
        extra_data,    // $12
        ];

        const result = await pool.query(insertQuery, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("createOreSample error:", err);
        res
        .status(500)
        .json({ message: "Ошибка сохранения руды", detail: err.message });
    }
}


export async function deleteOreSample(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await pool.query(
      "DELETE FROM ore_samples WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("deleteOreSample error:", err);
    res.status(500).json({ message: "Ошибка удаления руды" });
  }
}
