import React, { useState } from 'react';
import './QuestionBank.css';

export interface QuestionBankItem {
  id: number;
  snippet: string;
  form: string;
  chapter: string;
  type: 'Structured' | 'Objective' | 'Essay';
  difficulty: 'Low' | 'Medium' | 'High';
  contentMalay?: string;
  contentEnglish?: string;
}

interface QuestionBankEditorProps {
  initialData?: QuestionBankItem | null;
  onSave: (item: QuestionBankItem) => void;
  onCancel: () => void;
}

export const QuestionBankEditor: React.FC<QuestionBankEditorProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialData);

  const [snippet, setSnippet] = useState(initialData?.snippet || '');
  const [formLevel, setFormLevel] = useState(initialData?.form || '4');
  const [chapter, setChapter] = useState(initialData?.chapter || '5 - Wave');
  const [type, setType] = useState<QuestionBankItem['type']>(initialData?.type || 'Structured');
  const [difficulty, setDifficulty] = useState<QuestionBankItem['difficulty']>(
    initialData?.difficulty || 'Medium'
  );
  const [contentMalay, setContentMalay] = useState(
    initialData?.contentMalay || initialData?.snippet || ''
  );
  const [contentEnglish, setContentEnglish] = useState(
    initialData?.contentEnglish || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snippet.trim()) {
      alert('Please enter a question snippet.');
      return;
    }

    onSave({
      id: initialData?.id || Date.now(),
      snippet,
      form: formLevel,
      chapter,
      type,
      difficulty,
      contentMalay,
      contentEnglish,
    });
  };

  return (
    <div className="qb-wrapper">
      <header className="content-header">
        <h2>Teacher-Question Bank</h2>
      </header>

      <div className="qb-card-container">
        <div className="qb-editor-card">
          <h2 className="qb-editor-title">
            {isEditing ? 'Edit Question' : 'Add New Question'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="qb-form-grid">
              <div className="qb-form-field">
                <label>Question Snippet / Title :</label>
                <input
                  type="text"
                  value={snippet}
                  onChange={(e) => setSnippet(e.target.value)}
                  placeholder="e.g. Rajah 1.1 menunjukkan sebuah bandul..."
                  required
                />
              </div>

              <div className="qb-form-row-3">
                <div className="qb-form-field">
                  <label>FORM :</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                  >
                    <option value="4">Form 4</option>
                    <option value="5">Form 5</option>
                  </select>
                </div>

                <div className="qb-form-field">
                  <label>CHAPTER :</label>
                  <select
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                  >
                    <option value="5 - Wave">5 - Wave</option>
                    <option value="1 - Measurement">1 - Measurement</option>
                    <option value="2 - Force & Motion">2 - Force & Motion</option>
                  </select>
                </div>

                <div className="qb-form-field">
                  <label>TYPE :</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as QuestionBankItem['type'])}
                  >
                    <option value="Structured">Structured</option>
                    <option value="Objective">Objective</option>
                    <option value="Essay">Essay</option>
                  </select>
                </div>
              </div>

              <div className="qb-form-field">
                <label>DIFFICULTY :</label>
                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as QuestionBankItem['difficulty'])
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="qb-form-field">
                <label>Question Content (Bahasa Melayu) :</label>
                <textarea
                  rows={3}
                  value={contentMalay}
                  onChange={(e) => setContentMalay(e.target.value)}
                  placeholder="Rajah 1.1 menunjukkan..."
                />
              </div>

              <div className="qb-form-field">
                <label>Question Content (English) :</label>
                <textarea
                  rows={3}
                  value={contentEnglish}
                  onChange={(e) => setContentEnglish(e.target.value)}
                  placeholder="Diagram 1.1 shows..."
                />
              </div>
            </div>

            <div className="qb-editor-actions">
              <button
                type="button"
                className="btn-qb-cancel"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn-qb-save">
                {isEditing ? 'Save Changes' : 'Add Question'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};