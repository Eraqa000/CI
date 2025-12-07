// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GooeyNav from "./GooeyNav";
import { getAuthFromStorage, clearAuth } from "../api/auth";
import HomeIconBlack from "../assets/home_1.svg";
import HomeIconWhite from "../assets/home_2.svg";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = getAuthFromStorage();

  const isAuthed = Boolean(token && user);

  const navItems = [
    { label: "Главная", to: "/" },
    { label: "Первая задача", to: "/app/task1" },
    { label: "Вторая задача", to: "/app/task2" },
    { label: "Третья задача", to: "/app/task3" },
  ];

  const submenuConfig = [
    [
      {
        title: "О платформе",
        description: "Описание проекта и возможностей калькуляторов и ML.",
        to: "/",
      },
      {
        title: "Как начать",
        description: "Создайте аккаунт и загрузите свои данные.",
        to: "/register",
      },
      {
        title: "Документация",
        description: "Краткий гайд по шагам ML-пайплайна.",
        to: "/app/task1/explore",
      },
    ],
    [
      {
        title: "Изучить данные",
        description: "Загрузка файлов, просмотр признаков и статистик.",
        to: "/app/task1/explore",
      },
      {
        title: "Вычисления",
        description: "Выбор алгоритма, параметров и запуск обучения.",
        to: "/app/task1/compute",
      },
      {
        title: "Прямое предсказание",
        description: "",
        to: "/app/task1/direct",
      },
      {
        title: "Результаты",
        description: "Метрики качества и предсказания модели.",
        to: "/app/task1/results",
      },
    ],
    [
      {
        title: "Инженерный калькулятор",
        description: "Расчёт плавки, шлака и штейна.",
        to: "/app/task2/compute",
      },
      {
        title: "Диаграммы",
        description: "Графики и визуализация расчётов.",
        to: "/app/task2/compute",
      },
      {
        title: "История расчётов",
        description: "Сохранённые предыдущие вычисления.",
        to: "/app/task2/history",
      },
    ],
    [
      {
        title: "Демеркуризация",
        description: "Калькулятор процесса демеркуризации.",
        to: "/app/task3/calc1",
      },
      {
        title: "Извлечение золота",
        description: "Калькулятор извлечения золота.",
        to: "/app/task3/calc2",
      },
      {
        title: "Регенерация сорбента",
        description: "Калькулятор регенерации сорбента.",
        to: "/app/task3/calc3",
      },
    ],
  ];

  // по path определяем индекс активного пункта
  const getIndexFromPath = (path) => {
    if (path === "/") return 0;

    if (path.startsWith("/app/task1")) return 1;
    if (path.startsWith("/app/task2")) return 2;
    if (path.startsWith("/app/task3")) return 3;

    return 0; // по умолчанию
  };

  // какой пункт сейчас активен (для подсветки и иконки)
  const [activeIndex, setActiveIndex] = useState(
    getIndexFromPath(location.pathname)
  );

  // какое подменю раскрыто (или null)
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);

  // при смене URL обновляем активный пункт и закрываем подменю
  useEffect(() => {
    setActiveIndex(getIndexFromPath(location.pathname));
  }, [location.pathname]);

  const homeIcon = activeIndex === 0 ? HomeIconBlack : HomeIconWhite;

  const handleNavClick = (index) => {
    // клик по табу: только открыть/закрыть подменю + подсветить таб
    setOpenSubmenuIndex((prev) => (prev === index ? null : index));
  };

  const handleLogout = () => {
    clearAuth();
    setOpenSubmenuIndex(null);
    navigate("/login", { replace: true });
  };

  const currentSubmenu =
    openSubmenuIndex === null ? [] : submenuConfig[openSubmenuIndex] || [];

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          {/* ЛОГО */}
          <div
            className="logo"
            onClick={() => {
              navigate("/");
              // activeIndex и подменю синхронизируются через useEffect по location
            }}
          >
            CI
          </div>

          {/* GOOEY NAV */}
          <div className="center-nav">
            <GooeyNav
              items={navItems.map((i, index) => ({
                label: i.label,
                href: "#",
                icon: index === 0 ? homeIcon : null,
              }))}
              initialActiveIndex={activeIndex}
              onItemClick={handleNavClick}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>

          {/* АВТОРИЗАЦИЯ */}
          <div className="auth-block">
            {isAuthed ? (
              <>
                <span className="user-name">{user.full_name}</span>
                <button className="btn-secondary" onClick={handleLogout}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="link-muted">
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{ marginLeft: 12 }}
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ПОДМЕНЮ */}
      {currentSubmenu.length > 0 && (
        <div className="navbar-submenu-wrapper" key={openSubmenuIndex}>
          <div className="navbar-submenu">
            {currentSubmenu.map((item) => (
              <button
                key={item.title}
                className="submenu-card"
                onClick={() => {
                  navigate(item.to);
                  // подменю закроется через useEffect (смена location),
                  // но на всякий случай закроем сразу:
                  setOpenSubmenuIndex(null);
                }}
              >
                <div className="submenu-card-title">{item.title}</div>
                <div className="submenu-card-desc">{item.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
