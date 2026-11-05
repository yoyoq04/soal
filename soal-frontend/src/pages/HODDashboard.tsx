import React, { useState } from 'react';
import './HodDashboard.css';

interface DraftProject {
  id: number;
  title: string;
  subject: string;
  teacherName: string;
  status: 'Pending Review' | 'Approved' | 'Changes Requested';
  submittedDate: string;
}

interface HodDashboardProps {
  onReviewDraft?: (projectId: number) => void;
}

const INITIAL_DRAFTS: DraftProject[] = [
  {
    id: 101,
    title: 'SPM Mathematics Paper 2 (2026)',
    subject: 'Mathematics',
    teacherName: 'Cikgu Amir',
    status: 'Pending Review',
    submittedDate: '12 Oct 2026',
  },
  {
    id: 102,
    title: 'Form 4 Physics Mid-Term Exam',
    subject: 'Physics',
    teacherName: 'Cikgu Siti',
    status: 'Pending Review',
    submittedDate: '11 Oct 2026',
  },
  {
    id: 103,
    title: 'Form 5 Chemistry Monthly Test',
    subject: 'Chemistry',
    teacherName: 'Cikgu Tan',
    status: 'Approved',
    submittedDate: '08 Oct 2026',
  },
];

export const HodDashboard: React.FC<HodDashboardProps> = ({ onReviewDraft }) => {
  const [drafts, setDrafts] = useState<DraftProject[]>(INITIAL_DRAFTS);

  const handleUpdateStatus = (id: number, newStatus: DraftProject['status']) => {
    setDrafts(
      drafts.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  const pendingCount = drafts.filter((d) => d.status === 'Pending Review').length;
  const approvedCount = drafts.filter((d) => d.status === 'Approved').length;
  const changesCount = drafts.filter((d) => d.status === 'Changes Requested').length;

  return (
    <div className="hod-content-wrapper">
      <header className="content-header">
        <h2>HOD Review & Approval Dashboard</h2>
      </header>

      <div className="dashboard-card-container">
        {/* Stat Cards Row */}
        <div className="hod-stats-row">
          <div className="hod-stat-card">
            <h4>Pending Reviews</h4>
            <p className="hod-stat-number">{pendingCount}</p>
          </div>
          <div className="hod-stat-card">
            <h4>Approved Papers</h4>
            <p className="hod-stat-number">{approvedCount}</p>
          </div>
          <div className="hod-stat-card">
            <h4>Changes Requested</h4>
            <p className="hod-stat-number">{changesCount}</p>
          </div>
        </div>

        {/* Drafts Table Section */}
        <div className="hod-table-card">
          <h3>Submitted Exam Projects for Review</h3>
          <div className="table-responsive">
            <table className="hod-drafts-table">
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Subject</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drafts.map((draft) => (
                  <tr key={draft.id}>
                    <td className="title-cell">{draft.title}</td>
                    <td>{draft.subject}</td>
                    <td>{draft.teacherName}</td>
                    <td>{draft.submittedDate}</td>
                    <td>
                      <span
                        className={`status-badge ${draft.status
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        {draft.status}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button
                        className="btn-review"
                        onClick={() => onReviewDraft?.(draft.id)}
                      >
                        Review
                      </button>

                      {draft.status === 'Pending Review' && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => handleUpdateStatus(draft.id, 'Approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() =>
                              handleUpdateStatus(draft.id, 'Changes Requested')
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
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