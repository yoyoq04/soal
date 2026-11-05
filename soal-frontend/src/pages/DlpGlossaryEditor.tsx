import React, { useState } from 'react';
import './DlpGlossary.css';

export interface GlossaryTerm {
  id: number;
  englishTerm: string;
  malayTerm: string;
  subjectDomain: string;
}

interface DlpGlossaryEditorProps {
  initialData?: GlossaryTerm | null;
  onSave: (term: GlossaryTerm) => void;
  onCancel: () => void;
}

export const DlpGlossaryEditor: React.FC<DlpGlossaryEditorProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialData);

  const [englishTerm, setEnglishTerm] = useState(initialData?.englishTerm || '');
  const [malayTerm, setMalayTerm] = useState(initialData?.malayTerm || '');
  const [subjectDomain, setSubjectDomain] = useState(
    initialData?.subjectDomain || 'Physics / Form 4'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!englishTerm.trim() || !malayTerm.trim()) {
      alert('Please fill in both English and Bahasa Melayu terms.');
      return;
    }

    onSave({
      id: initialData?.id || Date.now(),
      englishTerm,
      malayTerm,
      subjectDomain,
    });
  };

  return (
    <div className="dlp-wrapper">
      <header className="content-header">
        <h2>Teacher-DLP Glossary</h2>
      </header>

      <div className="dlp-card-container">
        <div className="dlp-editor-card">
          <h2 className="dlp-editor-title">
            {isEditing ? 'Edit Term' : 'Add New Glossary Term'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="dlp-form-grid">
              <div className="dlp-form-field">
                <label>English Term (BI) :</label>
                <input
                  type="text"
                  value={englishTerm}
                  onChange={(e) => setEnglishTerm(e.target.value)}
                  placeholder="e.g. Damping"
                  required
                />
              </div>

              <div className="dlp-form-field">
                <label>Bahasa Melayu Term (BM) :</label>
                <input
                  type="text"
                  value={malayTerm}
                  onChange={(e) => setMalayTerm(e.target.value)}
                  placeholder="e.g. Pelembapan"
                  required
                />
              </div>

              <div className="dlp-form-field">
                <label>Subject / Domain :</label>
                <input
                  type="text"
                  value={subjectDomain}
                  onChange={(e) => setSubjectDomain(e.target.value)}
                  placeholder="e.g. Physics / Form 4"
                  required
                />
              </div>
            </div>

            <div className="dlp-editor-actions">
              <button
                type="button"
                className="btn-dlp-cancel"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn-dlp-save">
                {isEditing ? 'Save Changes' : 'Add Term'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};