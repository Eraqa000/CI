import { Link, useNavigate } from "react-router-dom";
import { getAuthFromStorage } from "../api/auth";

export default function Home() {

  const navigate = useNavigate();

  function handleStart() {
    const { token } = getAuthFromStorage();

    if (token) {
      // Пользователь авторизован
      navigate("/app/task1/explore");
    } else {
      // Не авторизован — отправляем на страницу входа
      navigate("/login");
    }
  }


  return (
    <div className="page-container">
      <section className="hero" style={{ paddingTop: "60px", paddingBottom: "40px" }}>
        
        <h1 className="page-title" style={{ marginBottom: "16px" }}>
          CI Calculator & AI Platform
        </h1>

        <p className="page-subtitle" style={{ maxWidth: "780px", lineHeight: "1.6" }}>
          Интеллектуальная инженерная платформа для расчётов, анализа составов руд,
          моделирования металлургических процессов и интеграции машинного обучения.
        </p>

        <div style={{ marginTop: "30px", display: "flex", gap: "16px" }}>
          
          {/* КНОПКА С ПРОВЕРКОЙ АВТОРИЗАЦИИ */}
          <button
            className="btn-primary"
            onClick={handleStart}
          >
            Начать работу
          </button>

          <a
            href="#features"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
              textDecoration: "none",
              color: "white",
            }}
          >
            Подробнее о возможностях
          </a>
        </div>
      </section>

      {/* Блок возможностей */}
      <section id="features" className="card" style={{ marginTop: "40px", padding: "32px" }}>
        <h2 style={{ marginBottom: "20px" }}>Возможности платформы</h2>

        <ul style={{ lineHeight: "1.8", fontSize: "16px" }}>
          <li><b>Химический анализ руд</b> с автоматическими вычислениями параметров и визуализацией.</li>
          <li><b>Инженерные калькуляторы</b> для металлургии, включая расчёт основности, тепловых и химических нагрузок.</li>
          <li><b>Модуль расчётов AI/ML</b> для прогнозирования свойств материалов и оптимизации процессов.</li>
          <li><b>История вычислений</b> с возможностью просмотра параметров и сравнения результатов.</li>
          <li><b>Гибкая система задач</b> — каждая задача выполняется как отдельный Job с сохранением входных данных и результатов.</li>
        </ul>
      </section>

    </div>
  );
}
