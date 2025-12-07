// src/pages/task1/Results.jsx
import { useEffect, useState } from "react";

export default function Task1Results() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("task1_last_results");
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        setData(null);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="page-container">
        <h1>Результаты вычислений</h1>
        <p>Нет данных для отображения. Запустите расчёт на предыдущем шаге.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Результаты вычислений</h1>

      <section className="card" style={{ marginTop: 24 }}>
        <h2>Параметры руд</h2>
        {/* можно повторить таблицу с исходными данными */}
      </section>

      <section className="card" style={{ marginTop: 24 }}>
        <h2>Рассчитанные параметры</h2>
        <table className="table-data">
          <thead>
            <tr>
              <th>Название</th>
              <th>Основность шлака  </th>
              <th>Нагрузка по сере, %</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((r) => (
              <tr key={r.sample_id}>
                <td>{r.sample_name}</td>
                <td>{r.slag_basicity ?? "—"}</td>
                <td>{r.sulphur_load}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
