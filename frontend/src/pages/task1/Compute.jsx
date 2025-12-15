import { useEffect, useState } from "react";
import { fetchOreSamples } from "../../api/oreSamples";
import { computeTask1 } from "../../api/task1";
import { useNavigate } from "react-router-dom";
import {
  createJob,
  saveJobInput,
  saveJobResult
} from "../../api/jobs";

export default function Task1Compute() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // загружаем руды
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOreSamples();
        if (mounted) setSamples(data);
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError(err.message || "Не удалось загрузить руды");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCompute = async () => {
  try {
    setComputing(true);
    setError(null);

    if (selected.size === 0) {
      setError("Выберите хотя бы одну руду");
      return;
    }

    const oreIds = [...selected];

    // 1. Создаём job
    const job = await createJob("calculator_calc1");

    // 2. Сохраняем входные данные
    await saveJobInput(job.id, {
      ore_ids: oreIds
    });

    // 3. Выполняем расчёт
    const data = await computeTask1(oreIds);

    // 4. Сохраняем результат
    await saveJobResult(job.id, "calculator_calc1", data);

    navigate("/app/task1/results");

  } catch (err) {
    console.error(err);
    setError(err.message || "Ошибка вычисления");
  } finally {
    setComputing(false);
  }
};



  function formatNumberCell(value) {
    if (value === null || value === undefined) return "-";
    const num = Number(value);
    if (isNaN(num)) return "-";
    return num.toFixed(2);
  }


  const [selected, setSelected] = useState(new Set());
  function toggleSelect(id) {
    setSelected(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  }


  return (
    <div className="page-container">
      <h1>Первая задача — Вычисления</h1>
      <p className="page-subtitle">
        Выберите руды и запустите расчёт. Позже сюда подключим ML-модель.
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

      <section className="card" style={{ marginTop: 24 }}>
        <h2>Выберите руды для вычислений</h2>

        {loading ? (
          <p>Загрузка...</p>
        ) : samples.length === 0 ? (
          <p>У вас пока нет сохранённых руд.</p>
        ) : (
          <>
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
                  </tr>
                </thead>
                <tbody>
                  {samples.map((s, idx) => (
                    <tr key={s.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(s.id)}
                        onChange={() => toggleSelect(s.id)}
                      />
                    </td>
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
                  </tr>
                  ))}
                </tbody>
              </table>
            </div> 

            <button
              className="btn-primary"
              style={{ marginTop: 16 }}
              onClick={handleCompute}
              disabled={computing}
            >
              {computing ? "Считаю..." : "Вычислить"}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
