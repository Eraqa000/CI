import { useEffect, useState } from "react";
import { fetchOreSamples } from "../../api/oreSamples";
import { computeTask1 } from "../../api/task1";
import { useNavigate } from "react-router-dom";

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

      if (samples.length === 0) {
        setError("Нет руд для расчёта");
        return;
      }

      // пока считаем все руды; позже можно сделать чекбоксы
      const oreIds = samples.map((s) => s.id);

      const data = await computeTask1(oreIds);

      // сохраним результат для страницы Results
      sessionStorage.setItem("task1_last_results", JSON.stringify(data));

      navigate("/app/task1/results");
    } catch (err) {
      console.error(err);
      setError(err.message || "Ошибка вычисления");
    } finally {
      setComputing(false);
    }
  };

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
            <table className="table-data">
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
                    <td>{idx + 1}</td>
                    <td>{s.sample_name}</td>
                    <td>{s.cu_pct}</td>
                    <td>{s.fe_pct}</td>
                    <td>{s.s_pct}</td>
                    <td>{s.sio2_pct}</td>
                    <td>{s.cao_pct}</td>
                    <td>{s.al2o3_pct}</td>
                    <td>{s.as_pct}</td>
                    <td>{s.au_gpt}</td>
                    <td>{s.ag_gpt}</td>
                  </tr>
                ))}
              </tbody>
            </table>

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
