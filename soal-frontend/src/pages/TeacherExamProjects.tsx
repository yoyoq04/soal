/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { TemplateEditor, type TemplateData } from './TemplateEditor';
import './TeacherExamProjects.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

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

// Helper to safely extract user ID whether stored as a string or inside a JSON object
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

  return 1; // Fallback default user ID
};

export const TeacherExamProjects: React.FC<TeacherExamProjectsProps> = ({
  onSelectTemplate,
}) => {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);

  // View state: 'list' | 'edit' | 'create'
  const [activeView, setActiveView] = useState<'list' | 'edit' | 'create'>('list');
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null);

  // Fetch templates specific to the logged-in user from FastAPI backend on load
  useEffect(() => {
    const currentUserId = getUserId();
    
    fetch(`${API_BASE}/exam-templates?user_id=${currentUserId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mappedTemplates: Template[] = data.map((item: any) => ({
            id: item.template_id,
            name: item.template_name,
            totalMarks: item.total_marks || 100,
            duration: '2 hour',
            structure: item.section_layout || 'Custom Layout',
            isDefault: false,
          }));
          setTemplates([...DEFAULT_TEMPLATES, ...mappedTemplates]);
        } else {
          setTemplates(DEFAULT_TEMPLATES);
        }
      })
      .catch((err) => console.error("Failed to load templates from database:", err));
  }, []);

  const handleSelectTemplate = (tmpl: Template) => {
    if (onSelectTemplate) {
      onSelectTemplate(tmpl.name);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    const tmpl = templates.find((t) => t.id === id);
    if (tmpl?.isDefault) return;

    if (window.confirm('Are you sure you want to delete this custom template?')) {
      try {
        const res = await fetch(`${API_BASE}/exam-templates/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete on server');
        setTemplates(templates.filter((t) => t.id !== id));
      } catch (err) {
        console.error("Error deleting template:", err);
      }
    }
  };

  const handleOpenEdit = (tmpl: Template) => {
    setEditingTemplate({
      id: tmpl.isDefault ? undefined : tmpl.id,
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

  const handleSaveTemplate = async (savedData: TemplateData) => {
    const sectionSummary = savedData.sections
      .map((s) => `${s.sectionName} (${s.sectionMarks}m)`)
      .join(', ');

    const currentUserId = getUserId();

    const payload = {
      template_name: savedData.name,
      section_layout: sectionSummary,
      total_marks: savedData.totalMarks,
      user_id: currentUserId,
    };

    if (activeView === 'edit' && savedData.id) {
      try {
        const res = await fetch(`${API_BASE}/exam-templates/${savedData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setTemplates(
            templates.map((t) =>
              t.id === Number(savedData.id)
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
        }
      } catch (err) {
        console.error("Error updating template:", err);
      }
    } else {
      try {
        const res = await fetch(`${API_BASE}/exam-templates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (res.ok) {
          const newItem = result.data ? result.data[0] : result;
          if (newItem && newItem.template_id) {
            const newTmpl: Template = {
              id: newItem.template_id,
              name: newItem.template_name,
              totalMarks: newItem.total_marks,
              duration: `${savedData.duration} hour`,
              structure: newItem.section_layout || sectionSummary,
              isDefault: false,
            };
            setTemplates([...templates, newTmpl]);
          }
        }
      } catch (err) {
        console.error("Error creating template:", err);
      }
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