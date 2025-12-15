// src/pages/task1/DirectPredict.jsx
import { useState } from "react";
import { predictForward } from "../../api/task1Ml";

const emptyForm = {
  ore_mass_t: "",
  cu_pct: "",
  fe_pct: "",
  s_pct: "",
  sio2_pct: "",
  cao_pct: "",
  al2o3_pct: "",
  as_pct: "",
  au_gpt: "",
  ag_gpt: "",
};

function parseNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const normalized = String(value).replace(",", ".");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

export default function Task1Direct() {
  const [form, setForm] = useState(emptyForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!form.ore_mass_t) {
      setError("Укажите общий вес руды");
      return;
    }

    const payload = {
      ore_mass_t: parseNumber(form.ore_mass_t),
      cu_pct: parseNumber(form.cu_pct),
      fe_pct: parseNumber(form.fe_pct),
      s_pct: parseNumber(form.s_pct),
      sio2_pct: parseNumber(form.sio2_pct),
      cao_pct: parseNumber(form.cao_pct),
      al2o3_pct: parseNumber(form.al2o3_pct),
      as_pct: parseNumber(form.as_pct),
      au_gpt: parseNumber(form.au_gpt),
      ag_gpt: parseNumber(form.ag_gpt),
    };

    try {
      setLoading(true);
      const data = await predictForward(payload);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Ошибка расчёта модели");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Прямой расчёт результатов плавки</h1>

      <p className="page-subtitle">
        Введите состав руды, и ML-модель предскажет, какие результаты штейна и
        шлака получатся при плавке.
      </p>

      {/* Подсказка, как на примере */}
      <div
        style={{
          marginTop: 16,
          marginBottom: 16,
          padding: "10px 14px",
          borderRadius: 10,
          background: "rgba(0, 180, 255, 0.08)",
          border: "1px solid rgba(0, 180, 255, 0.35)",
          fontSize: 14,
        }}
      >
        <b>Как это работает:</b> Введите химический состав руды (масса и
        содержания компонентов в процентах/г/т). Модель вернёт прогноз состава
        штейна и шлака.
      </div>

      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(255,0,0,0.1)",
            color: "#ff8080",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
            gap: 24,
            alignItems: "flex-start",
          }}
        >
          {/* ЛЕВАЯ КОЛОНКА — СОСТАВ РУДЫ */}
          <section className="card">
            <h2>Состав руды</h2>

            <div className="form-grid">
              <label className="form-row">
                <span>Общий вес руды, т</span>
                <input
                  type="text"
                  value={form.ore_mass_t}
                  onChange={handleChange("ore_mass_t")}
                />
              </label>

              <label className="form-row">
                <span>Медь Cu, %</span>
                <input
                  type="text"
                  value={form.cu_pct}
                  onChange={handleChange("cu_pct")}
                />
              </label>

              <label className="form-row">
                <span>Железо Fe, %</span>
                <input
                  type="text"
                  value={form.fe_pct}
                  onChange={handleChange("fe_pct")}
                />
              </label>

              <label className="form-row">
                <span>Сера S, %</span>
                <input
                  type="text"
                  value={form.s_pct}
                  onChange={handleChange("s_pct")}
                />
              </label>

              <label className="form-row">
                <span>SiO₂, %</span>
                <input
                  type="text"
                  value={form.sio2_pct}
                  onChange={handleChange("sio2_pct")}
                />
              </label>

              <label className="form-row">
                <span>CaO, %</span>
                <input
                  type="text"
                  value={form.cao_pct}
                  onChange={handleChange("cao_pct")}
                />
              </label>

              <label className="form-row">
                <span>Al₂O₃, %</span>
                <input
                  type="text"
                  value={form.al2o3_pct}
                  onChange={handleChange("al2o3_pct")}
                />
              </label>

              <label className="form-row">
                <span>Мышьяк As, %</span>
                <input
                  type="text"
                  value={form.as_pct}
                  onChange={handleChange("as_pct")}
                />
              </label>

              <label className="form-row">
                <span>Золото Au, г/т</span>
                <input
                  type="text"
                  value={form.au_gpt}
                  onChange={handleChange("au_gpt")}
                />
              </label>

              <label className="form-row">
                <span>Серебро Ag, г/т</span>
                <input
                  type="text"
                  value={form.ag_gpt}
                  onChange={handleChange("ag_gpt")}
                />
              </label>
            </div>
          </section>

          {/* ПРАВАЯ КОЛОНКА — РЕЗУЛЬТАТЫ */}
          <section className="card">
            <h2>Результаты плавки</h2>

            {!result ? (
              <p style={{ opacity: 0.8, fontSize: 14 }}>
                Заполните состав руды слева и нажмите кнопку
                <br />
                <b>«Предсказать результаты плавки»</b>.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="subcard">
                  <div className="subcard-title">Итоговые массы</div>
                  <dl className="metrics-list">
                    <div>
                      <dt>Масса штейна, т</dt>
                      <dd>{result.matte_mass.toFixed(3)}</dd>
                    </div>
                    <div>
                      <dt>Масса шлака, т</dt>
                      <dd>{result.slag_mass.toFixed(3)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </section>

        </div>

        {/* КНОПКА СНИЗУ */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button
            type="submit"
            className="btn-primary"
            style={{ minWidth: 280, fontSize: 16 }}
            disabled={loading}
          >
            {loading ? "Считаю..." : "Предсказать результаты плавки"}
          </button>
        </div>
      </form>
    </div>
  );
}
