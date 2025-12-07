import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, saveAuthToStorage } from "../api/auth";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser({
        full_name: fullName,
        email,
        password,
      });

      // data содержит:
      // { token: "...", user: {...} }
      saveAuthToStorage(data);

      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Регистрация</h1>
      <p className="page-subtitle">
        Создайте аккаунт, чтобы использовать калькуляторы и ML-модели.
      </p>

      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label>Имя пользователя</label>
            <input
              type="text"
              placeholder="Ваше имя"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p style={{ color: "red", fontSize: 14, marginTop: 4 }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Создаём..." : "Зарегистрироваться"}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
