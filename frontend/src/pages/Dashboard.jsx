export default function Dashboard() {
  return (
    <div className="page-container">
      <h1 className="page-title">Рабочий кабинет</h1>
      <p className="page-subtitle">
        Выберите задачу в верхнем меню или начните с просмотра данных и запуска расчётов.
      </p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Быстрый обзор</h2>
        <ul>
          <li>Первая задача – ML-модели для прогнозирования параметров плавки.</li>
          <li>Вторая задача – инженерный калькулятор штейна и шлака.</li>
          <li>Третья задача – специализированные калькуляторы (демеркуризация, извлечение золота и т.д.).</li>
        </ul>
      </div>
    </div>
  );
}
