import React, { useState } from 'react';
import './TemplateEditor.css';

export interface SectionRow {
  id: string;
  sectionName: string;
  questionType: 'Objective (MCQ)' | 'Structured' | 'Essay';
  sectionMarks: number;
}

export interface TemplateData {
  id?: number;
  name: string;
  totalMarks: number;
  duration: number;
  sections: SectionRow[];
}

interface TemplateEditorProps {
  initialData?: TemplateData | null; // If provided, mode is 'edit'; if null/undefined, mode is 'create'
  onSave: (template: TemplateData) => void;
  onCancel: () => void;
}

const DEFAULT_SECTIONS: SectionRow[] = [
  { id: '1', sectionName: 'Section A', questionType: 'Objective (MCQ)', sectionMarks: 20 },
  { id: '2', sectionName: 'Section B', questionType: 'Structured', sectionMarks: 30 },
  { id: '3', sectionName: 'Section C', questionType: 'Essay', sectionMarks: 50 },
];

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || '');
  const [totalMarks, setTotalMarks] = useState(initialData?.totalMarks || 100);
  const [duration, setDuration] = useState(initialData?.duration || 2.5);
  const [sections, setSections] = useState<SectionRow[]>(
    initialData?.sections || DEFAULT_SECTIONS
  );

  const handleAddSection = () => {
    const nextChar = String.fromCharCode(65 + sections.length); // A, B, C, D...
    const newSection: SectionRow = {
      id: Date.now().toString(),
      sectionName: `Section ${nextChar}`,
      questionType: 'Structured',
      sectionMarks: 10,
    };
    setSections([...sections, newSection]);
  };

  const handleDeleteSection = (id: string) => {
    if (sections.length <= 1) {
      alert('A template must have at least one section.');
      return;
    }
    setSections(sections.filter((s) => s.id !== id));
  };

  const handleSectionChange = (
    id: string,
    field: keyof SectionRow,
    value: string | number
  ) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a Template Name.');
      return;
    }

    onSave({
      id: initialData?.id,
      name,
      totalMarks: Number(totalMarks),
      duration: Number(duration),
      sections,
    });
  };

  return (
    <div className="template-editor-wrapper">
      <header className="content-header">
        <h2>Teacher Dashboard</h2>
      </header>

      <div className="editor-card-container">
        <div className="editor-white-card">
          <h2 className="editor-form-title">
            {isEditing ? 'Edit Template' : 'Create Custom Template'}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Top General Form Fields */}
            <div className="form-row-group">
              <div className="form-field inline-field">
                <label>Template Name :</label>
                <input
                  type="text"
                  className="input-text-long"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Standard KSSM Blueprint"
                  required
                />
              </div>

              <div className="form-field inline-field">
                <label>Total Marks :</label>
                <input
                  type="number"
                  className="input-number-short"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-field inline-field">
                <label>Duration :</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    step="0.1"
                    className="input-number-short"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    required
                  />
                  <span>hours</span>
                </div>
              </div>
            </div>

            {/* Section Layout Card */}
            <div className="section-layout-container">
              <h3 className="section-layout-title">Section Layout</h3>

              <div className="section-table">
                <div className="section-table-header">
                  <div>SECTION</div>
                  <div>QUESTION TYPE</div>
                  <div>SECTION MARKS</div>
                  <div>ACTIONS</div>
                </div>

                <div className="section-table-body">
                  {sections.map((sec) => (
                    <div key={sec.id} className="section-table-row">
                      {/* Section Name */}
                      <div className="col-section">
                        <input
                          type="text"
                          value={sec.sectionName}
                          onChange={(e) =>
                            handleSectionChange(sec.id, 'sectionName', e.target.value)
                          }
                          required
                        />
                      </div>

                      {/* Question Type */}
                      <div className="col-type">
                        <select
                          value={sec.questionType}
                          onChange={(e) =>
                            handleSectionChange(
                              sec.id,
                              'questionType',
                              e.target.value as SectionRow['questionType']
                            )
                          }
                        >
                          <option value="Objective (MCQ)">Objective (MCQ)</option>
                          <option value="Structured">Structured</option>
                          <option value="Essay">Essay</option>
                        </select>
                      </div>

                      {/* Section Marks */}
                      <div className="col-marks">
                        <input
                          type="number"
                          value={sec.sectionMarks}
                          onChange={(e) =>
                            handleSectionChange(
                              sec.id,
                              'sectionMarks',
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                      </div>

                      {/* Actions */}
                      <div className="col-actions">
                        <button
                          type="button"
                          className="btn-delete-section"
                          onClick={() => handleDeleteSection(sec.id)}
                          title="Delete Section"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="add-section-row">
                  <button
                    type="button"
                    className="btn-add-section"
                    onClick={handleAddSection}
                  >
                    <span>+</span> Add Section
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Form Action Buttons */}
            <div className="editor-form-actions">
              <button
                type="button"
                className="btn-editor-cancel"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn-editor-save">
                Save Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};