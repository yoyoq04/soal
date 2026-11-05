import React, { useState } from 'react';
import { registerApi } from '../api/client';
import './RegisterPage.css';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateToLogin,
  onRegisterSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [systemRole, setSystemRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      await registerApi({ username, email, systemRole, password });
      alert('Registration successful! Please log in with your credentials.');
      onRegisterSuccess();
    } catch (err: any) {
      console.error('Full registration error:', err);
      
      // Extract exact detail from FastAPI / Axios response
      const errorDetail = err.response?.data?.detail;
      let msg = 'Registration failed. Please check your backend connection.';
      
      if (typeof errorDetail === 'string') {
        msg = errorDetail;
      } else if (Array.isArray(errorDetail)) {
        // Handle Pydantic validation error arrays
        msg = errorDetail.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
      } else if (errorDetail) {
        msg = JSON.stringify(errorDetail);
      } else if (err.message) {
        msg = err.message;
      }
      
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-branding">
        <h1>SOAL</h1>
        <p>A Web-based Exam Paper Generator</p>
      </div>

      <div className="register-form-wrapper">
        <div className="register-card">
          <h2>Create Account</h2>

          {errorMsg && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              border: '1px solid #f87171', 
              color: '#991b1b', 
              padding: '0.75rem', 
              borderRadius: '6px', 
              marginBottom: '1rem', 
              fontSize: '0.85rem',
              wordBreak: 'break-word'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Ali bin Abu"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

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
              <label htmlFor="systemRole">System Role</label>
              <select
                id="systemRole"
                value={systemRole}
                onChange={(e) => setSystemRole(e.target.value)}
                required
              >
                <option value="" disabled>Select Role</option>
                <option value="Teacher">Subject Teacher</option>
                <option value="HOD">Head of Department (HOD)</option>
              </select>
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Sign Up'}
            </button>
          </form>

          <p className="login-text">
            Already have an account?{' '}
            <button type="button" className="link-button" onClick={onNavigateToLogin}>
              Login here
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
};