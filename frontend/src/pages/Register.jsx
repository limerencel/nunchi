import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <section className="page-shell page-shell--wide auth-shell">
      <div className="auth-panel">
        <div className="auth-copy">
          <p className="eyebrow">Join</p>
          <h1 className="feed-heading">Start reading with an account.</h1>
          <p className="feed-subtitle">
            Create a profile to publish threads, track discussions, and move from observer to participant.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="error-message" role="alert">{error}</p>}

          <div className="field-group">
            <label className="field-label" htmlFor="register-username">Username</label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="field-control"
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="field-control"
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="field-control"
            />
          </div>

          <div className="submit-row submit-row-stacked">
            <button type="submit" className="btn-primary">Create account</button>
            <p className="helper-copy">
              Already registered? <Link to="/login" className="inline-link">Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
