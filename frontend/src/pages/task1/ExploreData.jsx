import { useEffect, useState } from "react";
import {
  fetchOreSamples,
  createOreSample,
  deleteOreSample,
} from "../../api/oreSamples";

const emptyForm = {
  sample_name: "",
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

export default function Task1Explore() {
  const [form, setForm] = useState(emptyForm);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // загрузка руд при открытии страницы
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOreSamples();
        if (mounted) {
          setSamples(data);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Не удалось загрузить руды");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.sample_name.trim()) {
      setError("Укажите название руды");
      return;
    }

    const payload = {
      sample_name: form.sample_name.trim(),
      cu_pct: parseNumber(form.cu_pct),
      fe_pct: parseNumber(form.fe_pct),
      s_pct: parseNumber(form.s_pct),
      sio2_pct: parseNumber(form.sio2_pct),
      cao_pct: parseNumber(form.cao_pct),
      al2o3_pct: parseNumber(form.al2o3_pct),
      as_pct: parseNumber(form.as_pct),
      au_gpt: parseNumber(form.au_gpt),
      ag_gpt: parseNumber(form.ag_gpt),
      extra_data: null,
    };

    try {
      setSaving(true);
      const created = await createOreSample(payload);
      // добавляем в список
      setSamples((prev) => [...prev, created]);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      setError(err.message || "Не удалось сохранить руду");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить эту руду?")) return;
    try {
      await deleteOreSample(id);
      setSamples((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Не удалось удалить руду");
    }
  };

  function formatNumberCell(value) {
    if (value === null || value === undefined) return "—";
    const num = Number(value);
    if (!Number.isFinite(num)) return "—";
    return num.toFixed(2); // если хочешь запятую: .replace(".", ",")
  }



  return (
    <div className="page-container">
      <h1>Первая задача — Изучить данные</h1>
      <p className="page-subtitle">
        Здесь вы можете ввести химический состав руды, сохранить его и
        использовать затем при расчётах и AI-моделях.
      </p>

      <section className="card" style={{ marginTop: 24 }}>
        <h2>Добавить руду</h2>
        <p style={{ marginBottom: 12 }}>
          Десятичный разделитель — точка (например, <b>0.35</b>, а не 0,35).
        </p>

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
          <div className="table-responsive">
            <table className="table-input">

              <thead>
                <tr>
                  <th>Название</th>
                  <th>Cu, %</th>
                  <th>Fe, %</th>
                  <th>S, %</th>
                  <th>SiO₂, %</th>
                  <th>CaO, %</th>
                  <th>Al₂O₃, %</th>
                  <th>As, %</th>
                  <th>Au, г/т</th>
                  <th>Ag, г/т</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Название">
                    <input type="text" value={form.sample_name} onChange={handleChange("sample_name")} />
                  </td>

                  <td data-label="Cu, %">
                    <input type="text" value={form.cu_pct} onChange={handleChange("cu_pct")} />
                  </td>

                  <td data-label="Fe, %">
                    <input type="text" value={form.fe_pct} onChange={handleChange("fe_pct")} />
                  </td>

                  <td data-label="S, %">
                    <input type="text" value={form.s_pct} onChange={handleChange("s_pct")} />
                  </td>

                  <td data-label="SiO₂, %">
                    <input type="text" value={form.sio2_pct} onChange={handleChange("sio2_pct")} />
                  </td>

                  <td data-label="CaO, %">
                    <input type="text" value={form.cao_pct} onChange={handleChange("cao_pct")} />
                  </td>

                  <td data-label="Al₂O₃, %">
                    <input type="text" value={form.al2o3_pct} onChange={handleChange("al2o3_pct")} />
                  </td>

                  <td data-label="As, %">
                    <input type="text" value={form.as_pct} onChange={handleChange("as_pct")} />
                  </td>

                  <td data-label="Au, г/т">
                    <input type="text" value={form.au_gpt} onChange={handleChange("au_gpt")} />
                  </td>

                  <td data-label="Ag, г/т">
                    <input type="text" value={form.ag_gpt} onChange={handleChange("ag_gpt")} />
                  </td>
                </tr>


                {/* строка с кнопкой */}
                <tr>
                  {/* растягиваем на все 10 колонок */}
                  <td colSpan={10} style={{ textAlign: "right", paddingTop: 12 }}>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={saving}
                    >
                      {saving ? "Сохраняю..." : "Добавить руду"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
        
      </section>

      <section className="card" style={{ marginTop: 24 }}>
        <h2>Ваши руды</h2>

        {loading ? (
          <p>Загрузка...</p>
        ) : samples.length === 0 ? (
          <p>Пока нет ни одной руды. Добавьте первую через форму выше.</p>
        ) : (
          <div className="table-responsive">
            <table className="table-data ores-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Название</th>
                  <th>Cu, %</th>
                  <th>Fe, %</th>
                  <th>S, %</th>
                  <th>SiO₂, %</th>
                  <th>CaO, %</th>
                  <th>Al₂O₃, %</th>
                  <th>As, %</th>
                  <th>Au, г/т</th>
                  <th>Ag, г/т</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {samples.map((s, idx) => (
                  <tr key={s.id}>
                    <td className="cell-index">{idx + 1}</td>
                    <td className="cell-name">{s.sample_name}</td>

                    <td className="cell-num">{formatNumberCell(s.cu_pct)}</td>
                    <td className="cell-num">{formatNumberCell(s.fe_pct)}</td>
                    <td className="cell-num">{formatNumberCell(s.s_pct)}</td>
                    <td className="cell-num">{formatNumberCell(s.sio2_pct)}</td>
                    <td className="cell-num">{formatNumberCell(s.cao_pct)}</td>
                    <td className="cell-num">{formatNumberCell(s.al2o3_pct)}</td>
                    <td className="cell-num">{formatNumberCell(s.as_pct)}</td>
                    <td className="cell-num">{formatNumberCell(s.au_gpt)}</td>
                    <td className="cell-num">{formatNumberCell(s.ag_gpt)}</td>

                    <td className="cell-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => handleDelete(s.id)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
