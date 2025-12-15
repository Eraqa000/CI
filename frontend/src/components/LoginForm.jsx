import { useState } from "react";
import { loginUser, saveAuthToStorage } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ switchToRegister }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    try {
      const data = await loginUser({ email, password });
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

        <button className="neon-btn">Sign In</button>
      </form>

      {/* Добавляем ссылку переключения */}
      <p className="switch-text">
        Нет аккаунта?{" "}
        <span className="switch-btn" onClick={switchToRegister}>
          Sign Up
        </span>
      </p>
    </>
  );
}
