import React, { useState } from 'react';
import { QuestionBankEditor, type QuestionBankItem } from './QuestionBankEditor';
import './QuestionBank.css';

const INITIAL_QUESTIONS: QuestionBankItem[] = [
  {
    id: 1,
    snippet:
      'Rajah 1.1 menunjukkan sebuah bandul yang sedang berayun apabila...',
    form: '4',
    chapter: '5 - Wave',
    type: 'Structured',
    difficulty: 'Medium',
    contentMalay:
      'Rajah 1.1 menunjukkan sebuah bandul yang sedang berayun apabila bandul disesarkan sebanyak 0.2m dari kedudukan keseimbangan.',
    contentEnglish:
      'Diagram 1.1 shows a simple pendulum oscillating when displaced 0.2m from equilibrium position.',
  },
  {
    id: 2,
    snippet:
      'A simple pendulum is displaced and left to oscillate for 10s without any...',
    form: '4',
    chapter: '5 - Wave',
    type: 'Structured',
    difficulty: 'High',
    contentMalay:
      'Bandul ringkas disesarkan dan dibiarkan berayun selama 10s tanpa sebarang daya luar.',
    contentEnglish:
      'A simple pendulum is displaced and left to oscillate for 10s without any external force.',
  },
  {
    id: 3,
    snippet:
      'Nyatakan satu kaedah untuk membolehkan bandul itu berayun ta...',
    form: '4',
    chapter: '5 - Wave',
    type: 'Structured',
    difficulty: 'Low',
    contentMalay:
      'Nyatakan satu kaedah untuk membolehkan bandul itu berayun dengan amplitud pemalar.',
    contentEnglish:
      'State one method to enable the pendulum to oscillate with constant amplitude.',
  },
];

interface QuestionBankProps {
  onGenerateAI?: () => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({ onGenerateAI }) => {
  const [questions, setQuestions] = useState<QuestionBankItem[]>(INITIAL_QUESTIONS);

  // Filter Bar States
  const [searchText, setSearchText] = useState('');
  const [selectedForm, setSelectedForm] = useState('4');
  const [selectedChapter, setSelectedChapter] = useState('5 - Wave');
  const [selectedType, setSelectedType] = useState('Structured');

  // View Mode: 'list' | 'edit' | 'add'
  const [activeView, setActiveView] = useState<'list' | 'edit' | 'add'>('list');
  const [editingItem, setEditingItem] = useState<QuestionBankItem | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleOpenEdit = (q: QuestionBankItem) => {
    setEditingItem(q);
    setActiveView('edit');
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setActiveView('add');
  };

  const handleSaveQuestion = (item: QuestionBankItem) => {
    if (activeView === 'edit') {
      setQuestions(questions.map((q) => (q.id === item.id ? item : q)));
    } else {
      setQuestions([...questions, item]);
    }
    setActiveView('list');
  };

  // Filtered dataset
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.snippet.toLowerCase().includes(searchText.toLowerCase()) ||
      searchText === '';
    const matchesForm = selectedForm ? q.form === selectedForm : true;
    const matchesType = selectedType ? q.type.toUpperCase() === selectedType.toUpperCase() : true;
    return matchesSearch && matchesForm && matchesType;
  });

  if (activeView === 'edit' || activeView === 'add') {
    return (
      <QuestionBankEditor
        initialData={editingItem}
        onSave={handleSaveQuestion}
        onCancel={() => setActiveView('list')}
      />
    );
  }

  return (
    <div className="qb-wrapper">
      <header className="content-header">
        <h2>Teacher-Question Bank</h2>
      </header>

      <div className="qb-card-container">
        <h1 className="qb-main-title">Central Question Bank</h1>

        {/* Filter Toolbar matching screenshot */}
        <div className="qb-filter-bar">
          <div className="qb-search-input-wrapper">
            <input
              type="text"
              placeholder="Hinted search text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="qb-search-input"
            />
            <span className="qb-search-icon">🔍</span>
          </div>

          <div className="qb-filter-dropdown">
            <label>FORM :</label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
            >
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="qb-filter-dropdown">
            <label>CHAPTER :</label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
            >
              <option value="5 - Wave">5 - WA</option>
              <option value="1 - Measurement">1 - ME</option>
            </select>
          </div>

          <div className="qb-filter-dropdown">
            <label>TYPE :</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="STRUCTURED">STRUCTURED</option>
              <option value="OBJECTIVE">OBJECTIVE</option>
              <option value="ESSAY">ESSAY</option>
            </select>
          </div>
        </div>

        {/* Table Container White Card */}
        <div className="qb-table-card">
          <div className="table-responsive">
            <table className="qb-questions-table">
              <thead>
                <tr>
                  <th>QUESTION SNIPPET</th>
                  <th>FORM / TOPIC</th>
                  <th>TYPE</th>
                  <th>DIFFICULTY</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => (
                  <tr key={q.id}>
                    <td className="qb-snippet-cell">{q.snippet}</td>
                    <td>
                      Form {q.form} / Chapter {q.chapter.split('-')[0].trim()}
                    </td>
                    <td>{q.type}</td>
                    <td>
                      <span
                        className={`qb-diff-badge ${q.difficulty.toLowerCase()}`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="qb-action-buttons">
                        <button
                          className="btn-qb-action btn-qb-view"
                          onClick={() =>
                            alert(
                              `Question Content:\n\n[BM]: ${
                                q.contentMalay || q.snippet
                              }\n\n[EN]: ${q.contentEnglish || 'N/A'}`
                            )
                          }
                        >
                          👁️ View
                        </button>
                        <button
                          className="btn-qb-action btn-qb-edit"
                          onClick={() => handleOpenEdit(q)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-qb-action btn-qb-delete"
                          onClick={() => handleDelete(q.id)}
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

        {/* Bottom Actions */}
        <div className="qb-bottom-actions">
          <button className="btn-qb-add" onClick={handleOpenAdd}>
            <span className="plus-icon">+</span> Add New Question
          </button>
          <button
            className="btn-qb-generate"
            onClick={
              onGenerateAI ||
              (() => alert('Redirecting to AI Question Generator...'))
            }
          >
            <span className="plus-icon">+</span> Generate New Question
          </button>
        </div>
      </div>
    </div>
  );
};