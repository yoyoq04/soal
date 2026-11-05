import React, { useState } from 'react';
import './TeacherReport.css';

interface ApprovedProject {
  id: string;
  title: string;
  subjectDomain: string;
  createdBy: string;
}

interface ExportedProject {
  id: string;
  title: string;
  subjectDomain: string;
  createdBy: string;
}

const INITIAL_APPROVED_PROJECTS: ApprovedProject[] = [
  {
    id: 'PRJ_67',
    title: 'FINAL EXAM 2025 - CHEMISTRY PAPER 1',
    subjectDomain: 'Chemistry / Form 4',
    createdBy: 'T-06 Teacher Ahmad',
  },
  {
    id: 'PRJ_66',
    title: 'FINAL EXAM 2025 - CHEMISTRY PAPER 2',
    subjectDomain: 'Chemistry / Form 4',
    createdBy: 'T-06 Teacher Ahmad',
  },
  {
    id: 'PRJ_65',
    title: 'FINAL EXAM CHEMISTRY PAPER 1',
    subjectDomain: 'Chemistry / Form 4',
    createdBy: 'T-04 Teacher Nur Farah',
  },
  {
    id: 'PRJ_64',
    title: 'FINAL EXAM PHYSICS PAPER 2',
    subjectDomain: 'Physics / Form 4',
    createdBy: 'T-06 Teacher Ahmad',
  },
  {
    id: 'PRJ_63',
    title: 'FINAL EXAM CHEMISTRY PAPER 1',
    subjectDomain: 'Chemistry / Form 4',
    createdBy: 'T-04 Teacher Nur Farah',
  },
  {
    id: 'PRJ_62',
    title: 'PEPERIKSAAN AKHIR TAHUN FIZIK TINGKATAN 4- KERTAS 1',
    subjectDomain: 'Physics / Form 4',
    createdBy: 'T-12 Teacher Yong Vun Fei',
  },
];

const INITIAL_EXPORTED_PROJECTS: ExportedProject[] = [
  {
    id: 'PRJ_51',
    title: 'MIDTERM PHYSICS FORM 4',
    subjectDomain: 'Physics / Form 4',
    createdBy: 'T13 - Teacher Nur Hannah',
  },
  {
    id: 'PRJ_46',
    title: 'PHYSICS FORM 4',
    subjectDomain: 'Physics / Form 4',
    createdBy: 'T21 - Teacher Abdul Abu',
  },
];

export const TeacherReport: React.FC = () => {
  const [approvedProjects] = useState<ApprovedProject[]>(INITIAL_APPROVED_PROJECTS);
  const [exportedProjects, setExportedProjects] = useState<ExportedProject[]>(
    INITIAL_EXPORTED_PROJECTS
  );

  // Search & Filter state
  const [searchText, setSearchText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedForm, setSelectedForm] = useState('All');

  const handleExport = (proj: ApprovedProject) => {
    // Check if already exported
    if (exportedProjects.some((p) => p.id === proj.id)) {
      alert(`Project ${proj.id} is already in your exported list!`);
      return;
    }

    const newExported: ExportedProject = {
      id: proj.id,
      title: proj.title,
      subjectDomain: proj.subjectDomain,
      createdBy: proj.createdBy,
    };

    setExportedProjects([newExported, ...exportedProjects]);
    alert(`Successfully exported report for ${proj.title} (${proj.id})!`);
  };

  const handleDeleteExported = (id: string) => {
    if (window.confirm('Are you sure you want to remove this exported project?')) {
      setExportedProjects(exportedProjects.filter((p) => p.id !== id));
    }
  };

  // Filtered dataset
  const filteredApproved = approvedProjects.filter((proj) => {
    const matchesSearch =
      proj.id.toLowerCase().includes(searchText.toLowerCase()) ||
      proj.title.toLowerCase().includes(searchText.toLowerCase()) ||
      proj.createdBy.toLowerCase().includes(searchText.toLowerCase());

    const matchesSubject =
      selectedSubject === 'All' || proj.subjectDomain.includes(selectedSubject);

    const matchesForm =
      selectedForm === 'All' || proj.subjectDomain.includes(`Form ${selectedForm}`);

    return matchesSearch && matchesSubject && matchesForm;
  });

  return (
    <div className="report-wrapper">
      <header className="content-header">
        <h2>Teacher-Report</h2>
      </header>

      <div className="report-card-container">
        <h1 className="report-main-title">Manage Exam Paper Reports</h1>

        {/* Section 1: Approved Exam Paper Projects */}
        <div className="report-section">
          <h3 className="section-subtitle">Approved Exam Paper Projects:</h3>

          {/* Filter Bar */}
          <div className="report-filter-bar">
            <div className="report-search-wrapper">
              <input
                type="text"
                placeholder="Search by Project ID, Title or Teacher Name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="report-search-input"
              />
              <span className="report-search-icon">🔍</span>
            </div>

            <div className="report-filter-dropdown">
              <label>Subject :</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
              </select>
            </div>

            <div className="report-filter-dropdown">
              <label>Form :</label>
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
              >
                <option value="All">All</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>

          {/* Table 1: Approved Projects */}
          <div className="report-table-card">
            <div className="table-responsive">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Project ID</th>
                    <th>Project Title</th>
                    <th>Subject / Domain</th>
                    <th>Created By</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApproved.map((proj) => (
                    <tr key={proj.id}>
                      <td className="col-id">{proj.id}</td>
                      <td className="col-title">{proj.title}</td>
                      <td>{proj.subjectDomain}</td>
                      <td>{proj.createdBy}</td>
                      <td>
                        <button
                          className="btn-report-export"
                          onClick={() => handleExport(proj)}
                        >
                          ↪ Export
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 2: Your Exported Exam Paper Projects */}
        <div className="report-section">
          <h3 className="section-subtitle">Your Exported Exam Paper Projects:</h3>

          <div className="report-table-card">
            <div className="table-responsive">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Project ID</th>
                    <th>Project Title</th>
                    <th>Subject / Domain</th>
                    <th>Created By</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {exportedProjects.map((proj) => (
                    <tr key={proj.id}>
                      <td className="col-id">{proj.id}</td>
                      <td className="col-title">{proj.title}</td>
                      <td>{proj.subjectDomain}</td>
                      <td>{proj.createdBy}</td>
                      <td>
                        <div className="report-action-buttons">
                          <button
                            className="btn-report-action btn-report-view"
                            onClick={() =>
                              alert(`Viewing exported report for: ${proj.title}`)
                            }
                          >
                            👁️ View
                          </button>
                          <button
                            className="btn-report-action btn-report-delete"
                            onClick={() => handleDeleteExported(proj.id)}
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
    </div>
  );
};