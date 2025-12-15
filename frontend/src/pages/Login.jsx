import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser, saveAuthToStorage } from '../api/auth';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      saveAuthToStorage(data); // { token, user }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-page'>
      {/* 🔥 ВИДЕО-ФОН */}
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
          <h1 className="page-title">Вход</h1>
          <p className="page-subtitle">
            Авторизуйтесь, чтобы получить доступ к задачам и расчётам.
          </p>

          <div className="card">
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Пароль</label>
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="form-error">{error}</p>}


              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Входим..." : "Войти"}
              </button>
            </form>

            <p style={{ marginTop: 16, fontSize: 14 }}>
              Нет аккаунта? <Link to="/register">Создать</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}