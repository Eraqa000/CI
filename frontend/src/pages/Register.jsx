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
    <div className="auth-page">

      <video
          className="auth-bg-video"
          src="/videos/bg.mov"
          autoPlay
          loop
          muted
          playsInline
      />

      <div className="auth-content">
        <div className="page-container">
          <h1 className="page-title">Регистрация</h1>
          <p className="page-subtitle">
            Создайте аккаунт, чтобы использовать калькуляторы и ML-модели.
          </p>

          <div className="card">
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Имя пользователя</label>
                <input type="text" value={fullName} placeholder="login" onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div className="form-field">
                <label>Email</label>
                <input type="email" value={email} placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="form-field">
                <label>Пароль</label>
                <input type="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Создаём..." : "Зарегистрироваться"}
              </button>
            </form>

            


            <p style={{ marginTop: 16, fontSize: 14 }}>
              Есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
