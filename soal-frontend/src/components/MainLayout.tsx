import React from 'react';
import { Sidebar } from './Sidebar';
import type { UserProfile } from '../api/client';

interface MainLayoutProps {
  currentUser: UserProfile | null;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentUser,
  activeTab,
  onNavigateTab,
  onLogout,
  children,
}) => {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        onNavigateTab={onNavigateTab}
        onLogout={onLogout}
      />
      <main style={{ flexGrow: 1, height: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};