import React, { useState } from 'react';
import './TeacherDashboard.css';

interface ExamProject {
  id: number;
  title: string;
  createdDate: string;
  status: 'Draft' | 'Rejected' | 'Approved' | 'Pending';
}

interface TeacherDashboardProps {
  username?: string;
  onNavigateProjects?: () => void;
  onEditProject?: (projectTitle: string) => void;
}

const INITIAL_PROJECTS: ExamProject[] = [
  {
    id: 1,
    title: 'Pertengahan Tahun - Fizik F4',
    createdDate: '15 June 2026',
    status: 'Draft',
  },
  {
    id: 2,
    title: 'Ujian 1 - Kimia Tingkatan 5',
    createdDate: '02 June 2026',
    status: 'Rejected',
  },
  {
    id: 3,
    title: 'Akhir Tahun - Fizik Tingkatan 4',
    createdDate: '22 May 2026',
    status: 'Approved',
  },
  {
    id: 4,
    title: 'Pertengahan Tahun - Fizik F4',
    createdDate: '15 May 2026',
    status: 'Pending',
  },
];

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onNavigateProjects,
  onEditProject,
}) => {
  const [projects, setProjects] = useState<ExamProject[]>(INITIAL_PROJECTS);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this exam project?')) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="teacher-dash-wrapper">
      <header className="content-header">
        <h2>Teacher-Dashboard:</h2>
      </header>

      <div className="dashboard-card-container">
        <div className="dashboard-title-area">
          <h1>Teacher Dashboard</h1>
          <p>Welcome back! Here is the status of your exam paper draft.</p>
        </div>

        {/* Create New Exam Project Card */}
        <div className="create-project-banner" onClick={onNavigateProjects}>
          <h3>Create New Exam Project</h3>
          <p>Select a KSSM template framework to begin drafting.</p>
        </div>

        {/* Recent Exam Projects Section */}
        <div className="recent-projects-card">
          <h3>Recent Exam Projects</h3>
          <div className="table-responsive">
            <table className="recent-projects-table">
              <thead>
                <tr>
                  <th>PROJECT TITLE</th>
                  <th>CREATED DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id}>
                    <td className="title-cell">{proj.title}</td>
                    <td>{proj.createdDate}</td>
                    <td>
                      <span
                        className={`status-pill ${proj.status.toLowerCase()}`}
                      >
                        {proj.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() =>
                            onEditProject
                              ? onEditProject(proj.title)
                              : alert(`Editing: ${proj.title}`)
                          }
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(proj.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};