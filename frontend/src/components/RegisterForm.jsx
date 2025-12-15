import { useState } from "react";
import { registerUser, saveAuthToStorage } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ switchToLogin }) {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    try {
      const data = await registerUser({ full_name: fullName, email, password });
      saveAuthToStorage(data);
      nav("/app");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={submit}>
        <div className="input-group">
          <i className="icon bx bx-user"></i>
          <input
            type="text"
            placeholder="Имя"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <i className="icon bx bx-envelope"></i>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <i className="icon bx bx-lock-alt"></i>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {err && <p className="err-text">{err}</p>}

        <button className="neon-btn">Sign Up</button>
      </form>

      {/* Добавляем переключатель сюда */}
      <p className="switch-text">
        Уже есть аккаунт?{" "}
        <span className="switch-btn" onClick={switchToLogin}>
          Sign In
        </span>
      </p>
    </>
  );
}
