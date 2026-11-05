import React from 'react';
import type { UserProfile } from '../api/client';
import './Sidebar.css';

interface SidebarProps {
  currentUser: UserProfile | null;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  onNavigateTab,
  onLogout,
}) => {
  const isHod = currentUser?.role === 'HOD' || currentUser?.role === 'HoD';

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <h2>SOAL</h2>
        </div>

        <div className="user-profile-box">
          <p className="user-name">{currentUser?.username || 'User'}</p>
          <span className="user-role">{isHod ? 'Head of Department' : 'Teacher'}</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => onNavigateTab('dashboard')}
          >
            Dashboard
          </button>
          
          <button
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => onNavigateTab('projects')}
          >
            Exam Projects
          </button>

          <button
            className={activeTab === 'question-bank' ? 'active' : ''}
            onClick={() => onNavigateTab('question-bank')}
          >
            Question Bank
          </button>

          <button
            className={activeTab === 'dlp-glossary' ? 'active' : ''}
            onClick={() => onNavigateTab('dlp-glossary')}
          >
            DLP Glossary
          </button>

          <button
            className={activeTab === 'report' ? 'active' : ''}
            onClick={() => onNavigateTab('report')}
          >
            Report
          </button>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};