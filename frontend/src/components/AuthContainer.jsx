import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./auth.css";

export default function AuthContainer() {
  const location = useLocation();

  // режим по умолчанию = login
  const [mode, setMode] = useState("login");

  // если URL содержит /register → автоматически включаем режим регистрации
  useEffect(() => {
    if (location.pathname === "/register") {
      setMode("register");
    } else {
      setMode("login");
    }
  }, [location.pathname]);

  return (
    <div className="auth-wrapper">
      <div className={`auth-card ${mode === "register" ? "shifted" : ""}`}>
        
        <h2 className="auth-title">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        {mode === "login" ? (
          <LoginForm switchToRegister={() => setMode("register")} />
        ) : (
          <RegisterForm switchToLogin={() => setMode("login")} />
        )}
      </div>

      <div className="neon-shape shape1"></div>
      <div className="neon-shape shape2"></div>
      <div className="neon-shape shape3"></div>
    </div>
  );
}
