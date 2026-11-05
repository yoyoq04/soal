import React, { useState } from 'react';
import { DlpGlossaryEditor, type GlossaryTerm } from './DlpGlossaryEditor';
import './DlpGlossary.css';

const INITIAL_TERMS: GlossaryTerm[] = [
  {
    id: 1,
    englishTerm: 'Amplitude',
    malayTerm: 'Amplitud',
    subjectDomain: 'Physics / Form 4',
  },
  {
    id: 2,
    englishTerm: 'Damping',
    malayTerm: 'Pelembapan',
    subjectDomain: 'Physics / Form 4',
  },
  {
    id: 3,
    englishTerm: 'Frequency',
    malayTerm: 'Frekuensi',
    subjectDomain: 'Physics / Form 4',
  },
  {
    id: 4,
    englishTerm: 'Oscillation',
    malayTerm: 'Ayunan',
    subjectDomain: 'Physics / Form 4',
  },
  {
    id: 5,
    englishTerm: 'Pendulum',
    malayTerm: 'Bandul',
    subjectDomain: 'Physics / Form 4',
  },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const DlpGlossary: React.FC = () => {
  const [terms, setTerms] = useState<GlossaryTerm[]>(INITIAL_TERMS);

  // Filter States
  const [searchText, setSearchText] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');

  // View States
  const [activeView, setActiveView] = useState<'list' | 'edit' | 'add'>('list');
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this term?')) {
      setTerms(terms.filter((t) => t.id !== id));
    }
  };

  const handleOpenEdit = (term: GlossaryTerm) => {
    setEditingTerm(term);
    setActiveView('edit');
  };

  const handleOpenAdd = () => {
    setEditingTerm(null);
    setActiveView('add');
  };

  const handleSaveTerm = (savedTerm: GlossaryTerm) => {
    if (activeView === 'edit') {
      setTerms(terms.map((t) => (t.id === savedTerm.id ? savedTerm : t)));
    } else {
      setTerms([...terms, savedTerm]);
    }
    setActiveView('list');
  };

  // Filtered dataset
  const filteredTerms = terms.filter((item) => {
    const matchesSearch =
      item.englishTerm.toLowerCase().includes(searchText.toLowerCase()) ||
      item.malayTerm.toLowerCase().includes(searchText.toLowerCase()) ||
      item.subjectDomain.toLowerCase().includes(searchText.toLowerCase());

    const matchesLetter =
      selectedLetter === 'All' ||
      item.englishTerm.toUpperCase().startsWith(selectedLetter);

    return matchesSearch && matchesLetter;
  });

  if (activeView === 'edit' || activeView === 'add') {
    return (
      <DlpGlossaryEditor
        initialData={editingTerm}
        onSave={handleSaveTerm}
        onCancel={() => setActiveView('list')}
      />
    );
  }

  return (
    <div className="dlp-wrapper">
      <header className="content-header">
        <h2>Teacher-DLP Glossary</h2>
      </header>

      <div className="dlp-card-container">
        <h1 className="dlp-main-title">DLP Glossary Reference</h1>

        {/* Search and Alphabetical Filter Bar matching screenshot */}
        <div className="dlp-filter-bar">
          <div className="dlp-search-input-wrapper">
            <input
              type="text"
              placeholder="Hinted search text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="dlp-search-input"
            />
            <span className="dlp-search-icon">🔍</span>
          </div>

          <div className="dlp-alphabet-picker">
            <span
              className={`alphabet-link ${
                selectedLetter === 'All' ? 'active' : ''
              }`}
              onClick={() => setSelectedLetter('All')}
            >
              All
            </span>
            <span className="divider">|</span>
            {ALPHABET.map((letter, idx) => (
              <React.Fragment key={letter}>
                <span
                  className={`alphabet-link ${
                    selectedLetter === letter ? 'active' : ''
                  }`}
                  onClick={() => setSelectedLetter(letter)}
                >
                  {letter}
                </span>
                {idx < ALPHABET.length - 1 && <span className="divider">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Table Container White Card */}
        <div className="dlp-table-card">
          <div className="table-responsive">
            <table className="dlp-terms-table">
              <thead>
                <tr>
                  <th>English Term (BI)</th>
                  <th>Bahasa Melayu Term (BM)</th>
                  <th>Subject / Domain</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTerms.map((term) => (
                  <tr key={term.id}>
                    <td className="term-cell-en">{term.englishTerm}</td>
                    <td className="term-cell-bm">{term.malayTerm}</td>
                    <td>{term.subjectDomain}</td>
                    <td>
                      <div className="dlp-action-buttons">
                        <button
                          className="btn-dlp-action btn-dlp-edit"
                          onClick={() => handleOpenEdit(term)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-dlp-action btn-dlp-delete"
                          onClick={() => handleDelete(term.id)}
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

        {/* Bottom Add Action */}
        <div className="dlp-bottom-actions">
          <button className="btn-dlp-add" onClick={handleOpenAdd}>
            <span className="plus-icon">+</span> Add New Term
          </button>
        </div>
      </div>
    </div>
  );
};