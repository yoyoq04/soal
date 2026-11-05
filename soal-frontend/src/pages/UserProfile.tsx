/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import './TeacherExamProjects.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

interface UserProfileData {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const getUserId = (): number => {
  const rawId = localStorage.getItem("user_id");
  if (rawId) {
    const parsed = parseInt(rawId, 10);
    if (!isNaN(parsed)) return parsed;
  }

  const userObjStr = localStorage.getItem("user") || localStorage.getItem("currentUser");
  if (userObjStr) {
    try {
      const parsedUser = JSON.parse(userObjStr);
      if (parsedUser?.id) return parseInt(parsedUser.id, 10);
      if (parsedUser?.user_id) return parseInt(parsedUser.user_id, 10);
    } catch {
      const parsedNum = parseInt(userObjStr, 10);
      if (!isNaN(parsedNum)) return parsedNum;
    }
  }
  return 1;
};

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const currentUserId = getUserId();

  useEffect(() => {
    fetch(`${API_BASE}/users/${currentUserId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setUsername(data.username);
        setEmail(data.email);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load user profile.');
      });
  }, [currentUserId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload: any = { username, email };
    if (password.trim() !== '') {
      payload.password = password;
    }

    try {
      const res = await fetch(`${API_BASE}/users/${currentUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      setMessage('Profile updated successfully!');
      setPassword(''); // Clear password field after update
    } catch (err) {
      console.error(err);
      setError('Error updating profile.');
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      try {
        const res = await fetch(`${API_BASE}/users/${currentUserId}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete account');

        // Clear local storage and redirect or reload
        localStorage.clear();
        window.location.href = '/login'; // Adjust to your login route
      } catch (err) {
        console.error(err);
        setError('Error deleting account.');
      }
    }
  };

  if (!user && !error) {
    return <div className="teacher-projects-wrapper"><p>Loading profile...</p></div>;
  }

  return (
    <div className="teacher-projects-wrapper">
      <header className="content-header">
        <h2>User Management:</h2>
      </header>

      <div className="dashboard-card-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 className="section-title">My Account Profile</h1>

        {message && <div style={{ color: 'green', marginBottom: '15px' }}>{message}</div>}
        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>User ID:</label>
            <input
              type="text"
              value={user?.id || ''}
              disabled
              style={{ width: '100%', padding: '10px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>New Password (leave blank to keep current):</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Role:</label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              style={{ width: '100%', padding: '10px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Member Since:</label>
            <input
              type="text"
              value={user?.created_at ? new Date(user.created_at).toLocaleString() : ''}
              disabled
              style={{ width: '100%', padding: '10px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              className="btn-select"
              style={{ flex: 1, padding: '12px', cursor: 'pointer' }}
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={handleDeleteAccount}
              style={{ flex: 1, padding: '12px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};