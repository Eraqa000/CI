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

  const isAdmin =
    user?.role ==="admin" ||
    user?.status === "admin";

  const isAuthed = Boolean(token && user);

  const navItems = [
    { label: "Главная", to: "/" },
    { label: "Первая задача", to: "/app/task1" },
    { label: "Вторая задача", to: "/app/task2" },
    { label: "Третья задача", to: "/app/task3" },
    ...(isAdmin ? [{ label: "Admin", to: "/app/admin" }] : []),
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
        to: "/",
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
    if (path.startsWith("/app/admin")) return navItems.length - 1;


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
    if (!submenuConfig[index] || submenuConfig[index].length === 0) {
      navigate(navItems[index].to);
    }

  };

  const handleLogout = () => {
    clearAuth();
    setOpenSubmenuIndex(null);
    navigate("/login", { replace: true });
  };

  const currentSubmenu =
    openSubmenuIndex === null ? [] : submenuConfig[openSubmenuIndex] || [];

  const [openProfile, setOpenProfile] = useState(false);


  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenuIndex, setMobileSubmenuIndex] = useState(null);


  const mobileMenu = (
    <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
      {navItems.map((item, index) => (
        <div key={item.label}>
          {/* Кнопка раздела */}
          <button
            className="mobile-nav-item"
            onClick={() => {
              // если есть подменю — раскрываем
              if (submenuConfig[index] && submenuConfig[index].length > 0 && item.to !== "/app/admin") {
                setMobileSubmenuIndex(prev => prev === index ? null : index);
              } else {
                navigate(item.to);
                setMobileOpen(false);
              }
            }}
          >
            {item.label}
          </button>

          {/* Подменю */}
          {mobileSubmenuIndex === index && (
            <div className="mobile-submenu">
              {submenuConfig[index].map(sub => (
                <button
                  key={sub.title}
                  className="mobile-submenu-item"
                  onClick={() => {
                    navigate(sub.to);
                    setMobileOpen(false);
                    setMobileSubmenuIndex(null);
                  }}
                >
                  {sub.title}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}


      {isAuthed ? (
        <button className="mobile-logout" onClick={() => { setMobileOpen(false); handleLogout();}}>
          Выйти
        </button>
      ) : (
        <button className="mobile-login" onClick={() => { setMobileOpen(false); navigate("/login"); }} >
          Войти
        </button>
      )}
    </div>
  );



  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">

          {/* ЛОГО */}
          <div
            className="logo"
            onClick={() => {
              navigate("/");
            }}
          >
            CI
          </div>

          {/* NAVBAR (десктоп) */}
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

          {/* БУРГЕР-ТОЛЬКО МОБИЛЬНЫЙ */}
          <button
            className="burger-btn"
            onClick={() => setMobileOpen((v) => !v)}
          >
            ☰
          </button>

          {/* AUTH BLOCK */}
          <div className="auth-block">
            {isAuthed ? (
              <div className="profile-dropdown-wrapper">
                <button
                  className="profile-btn"
                  onClick={() => setOpenProfile((v) => !v)}
                >
                  <span className="profile-avatar">
                    {user.full_name?.[0]?.toUpperCase()}
                  </span>
                  <span>{user.full_name}</span>
                  <span className="arrow">▾</span>
                </button>

                {openProfile && (
                  <div className="profile-card">
                    <div className="pc-avatar">
                      {user.full_name?.[0]?.toUpperCase()}
                    </div>

                    <div className="pc-name">{user.full_name}</div>
                    <div className="pc-email">{user.email}</div>

                    <hr className="pc-divider" />

                    <div className="pc-row">
                      <span>Роль:</span>
                      <b>{user.role}</b>
                    </div>

                    <div className="pc-row">
                      <span>Статус:</span>
                      <b>{user.status}</b>
                    </div>

                    <button className="pc-logout" onClick={handleLogout}>
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Войти
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* Мобильное меню ВНЕ header */}
      {mobileMenu}


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
