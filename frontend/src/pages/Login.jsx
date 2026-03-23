import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <section className="page-shell page-shell--wide auth-shell">
      <div className="auth-panel">
        <div className="auth-copy">
          <p className="eyebrow">Welcome back</p>
          <h1 className="feed-heading">Return to the reading room.</h1>
          <p className="feed-subtitle">
            Log in to publish, comment, and keep your place inside the quieter threads.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="error-message" role="alert">{error}</p>}

          <div className="field-group">
            <label className="field-label" htmlFor="login-username">Username</label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="field-control"
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="field-control"
            />
          </div>

          <div className="submit-row submit-row-stacked">
            <button type="submit" className="btn-primary">Log in</button>
            <p className="helper-copy">
              New here? <Link to="/register" className="inline-link">Create an account</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
