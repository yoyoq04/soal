import React, { useState } from 'react';
import { TemplateEditor, type TemplateData } from './TemplateEditor';
import './TeacherExamProjects.css';

interface Template {
  id: number;
  name: string;
  totalMarks: number;
  duration: string;
  structure: string;
  isDefault: boolean;
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 1,
    name: 'KSSM Short Format',
    totalMarks: 40,
    duration: '1 hour',
    structure: 'Section A (10m), Section B (30m)',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Standard KSSM Blueprint',
    totalMarks: 100,
    duration: '2.5 hour',
    structure: 'Section A (20m), Section B (30m), Section C (50m)',
    isDefault: true,
  },
  {
    id: 3,
    name: 'SPM Trial Format (Paper 2)',
    totalMarks: 100,
    duration: '2.5 hour',
    structure: 'Higher-order thinking focus',
    isDefault: true,
  },
];

interface TeacherExamProjectsProps {
  onSelectTemplate?: (templateName: string) => void;
}

export const TeacherExamProjects: React.FC<TeacherExamProjectsProps> = ({
  onSelectTemplate,
}) => {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);

  // View state: 'list' | 'edit' | 'create'
  const [activeView, setActiveView] = useState<'list' | 'edit' | 'create'>('list');
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null);

  const handleSelectTemplate = (tmpl: Template) => {
    if (onSelectTemplate) {
      onSelectTemplate(tmpl.name);
    }
  };

  const handleDeleteTemplate = (id: number) => {
    const tmpl = templates.find((t) => t.id === id);
    if (tmpl?.isDefault) return;
    if (window.confirm('Are you sure you want to delete this custom template?')) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  const handleOpenEdit = (tmpl: Template) => {
    setEditingTemplate({
      id: tmpl.id,
      name: tmpl.name,
      totalMarks: tmpl.totalMarks,
      duration: parseFloat(tmpl.duration),
      sections: [
        { id: '1', sectionName: 'Section A', questionType: 'Objective (MCQ)', sectionMarks: 20 },
        { id: '2', sectionName: 'Section B', questionType: 'Structured', sectionMarks: 30 },
        { id: '3', sectionName: 'Section C', questionType: 'Essay', sectionMarks: 50 },
      ],
    });
    setActiveView('edit');
  };

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setActiveView('create');
  };

  const handleSaveTemplate = (savedData: TemplateData) => {
    const sectionSummary = savedData.sections
      .map((s) => `${s.sectionName} (${s.sectionMarks}m)`)
      .join(', ');

    if (activeView === 'edit' && savedData.id) {
      setTemplates(
        templates.map((t) =>
          t.id === savedData.id
            ? {
                ...t,
                name: savedData.name,
                totalMarks: savedData.totalMarks,
                duration: `${savedData.duration} hour`,
                structure: sectionSummary,
              }
            : t
        )
      );
    } else {
      const newTmpl: Template = {
        id: Date.now(),
        name: savedData.name,
        totalMarks: savedData.totalMarks,
        duration: `${savedData.duration} hour`,
        structure: sectionSummary,
        isDefault: false,
      };
      setTemplates([...templates, newTmpl]);
    }

    setActiveView('list');
  };

  if (activeView === 'edit' || activeView === 'create') {
    return (
      <TemplateEditor
        initialData={editingTemplate}
        onSave={handleSaveTemplate}
        onCancel={() => setActiveView('list')}
      />
    );
  }

  return (
    <div className="teacher-projects-wrapper">
      <header className="content-header">
        <h2>Teacher-Exam Projects:</h2>
      </header>

      <div className="dashboard-card-container">
        <h1 className="section-title">Exam Paper Template Layout</h1>

        <div className="templates-grid">
          {templates.map((tmpl) => (
            <div key={tmpl.id} className="template-card">
              <div className="card-top-content">
                <h3 className="template-title">{tmpl.name}</h3>
                <ul className="template-details">
                  <li>
                    <strong>Total Marks:</strong> {tmpl.totalMarks}
                  </li>
                  <li>
                    <strong>Duration:</strong> {tmpl.duration}
                  </li>
                  <li>
                    <strong>Structure:</strong> {tmpl.structure}
                  </li>
                </ul>
              </div>

              <div className="card-actions">
                <button
                  className="btn-select"
                  onClick={() => handleSelectTemplate(tmpl)}
                >
                  Select Template
                </button>

                <button
                  className="btn-icon btn-edit"
                  title="Edit Template"
                  onClick={() => handleOpenEdit(tmpl)}
                >
                  ✏️
                </button>

                <button
                  className={`btn-icon btn-delete ${
                    tmpl.isDefault ? 'disabled' : ''
                  }`}
                  disabled={tmpl.isDefault}
                  title={
                    tmpl.isDefault
                      ? 'Default templates cannot be deleted'
                      : 'Delete template'
                  }
                  onClick={() => handleDeleteTemplate(tmpl.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          <div className="template-card create-card" onClick={handleOpenCreate}>
            <button className="create-custom-btn">Create Custom Template</button>
          </div>
        </div>
      </div>
    </div>
  );
};