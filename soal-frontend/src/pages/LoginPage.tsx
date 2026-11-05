import React, { useState } from 'react';
import { loginApi, type UserProfile } from '../api/client';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await loginApi({ email, password });
      onLoginSuccess(res.user);
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-branding">
        <h1>SOAL</h1>
        <p>A Web-based Exam Paper Generator</p>
      </div>

      <div className="login-form-wrapper">
        <div className="login-card">
          <h2>LOGIN</h2>

          {errorMsg && (
            <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
              {errorMsg}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="register-text">
            Don’t have an account?{' '}
            <button type="button" className="link-button" onClick={onNavigateToRegister}>
              Register here
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
};