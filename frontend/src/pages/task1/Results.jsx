import { useEffect, useState } from "react";
import { loadJobResults, deleteJobResult } from "../../api/jobs";

export default function Task1Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const all = await loadJobResults();

      // берём только calculator_calc1
      const task1 = all.filter(r => r.task_type === "calculator_calc1");

      setResults(task1);
    } catch (err) {
      console.error(err);
      setError("Ошибка загрузки результатов");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Удалить этот результат?")) return;

    try {
      await deleteJobResult(id);

      // Обновляем список
      setResults(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      setError("Ошибка удаления");
    }
  }

  if (loading) return <p>Загрузка...</p>;
  if (results.length === 0) return <p>Нет сохранённых результатов.</p>;

  return (
    <div className="page-container">
      <h1>Результаты вычислений</h1>

      <section className="card" style={{ marginTop: 24 }}>
        <h2>Рассчитанные параметры</h2>
        <div className="table-responsive">
        <table className="table-data ores-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Название</th>
              <th>Основность шлака</th>
              <th>Нагрузка по сере, %</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {results.map(r => (
              r.payload.results.map(item => (
                <tr key={item.sample_id + "_" + r.id}>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>{item.sample_name}</td>
                  <td>{item.slag_basicity ?? "—"}</td>
                  <td>{item.sulphur_load}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => handleDelete(r.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
}
