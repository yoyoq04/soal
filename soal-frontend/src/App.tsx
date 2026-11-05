import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MainLayout } from './components/MainLayout';
import { UserProfile as UserProfilePage } from './pages/UserProfile';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { TeacherExamProjects } from './pages/TeacherExamProjects';
import { ExamCreatorWorkspace } from './pages/ExamCreatorWorkspace';
import { HodDashboard } from './pages/HODDashboard';
import { QuestionBank } from './pages/QuestionBank';
import { DlpGlossary } from './pages/DlpGlossary';
import { TeacherReport } from './pages/TeacherReport';
import type { UserProfile } from './api/client';

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Workspace State
  const [activeWorkspaceTitle, setActiveWorkspaceTitle] = useState<string | null>(null);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    setActiveWorkspaceTitle(null);
  };

  const handleOpenWorkspace = (title: string) => {
    setActiveWorkspaceTitle(title);
    setActiveTab('workspace');
  };

  return (
    <main>
      {/* Unauthenticated Routes */}
      {currentPage === 'login' && (
        <LoginPage
          onNavigateToRegister={() => setCurrentPage('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPage === 'register' && (
        <RegisterPage
          onNavigateToLogin={() => setCurrentPage('login')}
          onRegisterSuccess={() => setCurrentPage('login')}
        />
      )}

      {/* Authenticated Layout and Tab Navigation */}
      {currentPage === 'dashboard' && currentUser && (
        <MainLayout
          currentUser={currentUser}
          activeTab={activeTab === 'workspace' ? 'projects' : activeTab}
          onNavigateTab={(tab) => {
            setActiveWorkspaceTitle(null);
            setActiveTab(tab);
          }}
          onLogout={handleLogout}
        >
          {activeTab === 'dashboard' && (
            currentUser.role === 'HOD' ? (
              <HodDashboard
                onReviewDraft={(id) => alert(`Opening draft project #${id} for review...`)}
              />
            ) : (
              <TeacherDashboard
                onNavigateProjects={() => setActiveTab('projects')}
                onEditProject={(title) => handleOpenWorkspace(title)}
              />
            )
          )}

          {activeTab === 'profile' && <UserProfilePage />}

          {activeTab === 'projects' && (
            <TeacherExamProjects
              onSelectTemplate={(templateName) =>
                handleOpenWorkspace(`Pertengahan Tahun - ${templateName}`)
              }
            />
          )}

          {activeTab === 'workspace' && (
            <ExamCreatorWorkspace
              projectTitle={activeWorkspaceTitle || 'Pertengahan Tahun - Fizik F4'}
              onSubmitForReview={() => {
                alert('Exam project submitted to Head of Department (HOD) for review!');
                setActiveTab('dashboard');
                setActiveWorkspaceTitle(null);
              }}
            />
          )}

          {activeTab === 'question-bank' && (
            <QuestionBank
              onGenerateAI={() => handleOpenWorkspace('AI Question Bank Generation')}
            />
          )}

          {activeTab === 'dlp-glossary' && <DlpGlossary />}

          {activeTab === 'report' && <TeacherReport />}
          
        </MainLayout>
      )}
    </main>
  );
}

export default App;