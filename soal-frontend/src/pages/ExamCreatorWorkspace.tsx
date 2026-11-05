import React, { useState } from 'react';
import './ExamCreatorWorkspace.css';

interface QuestionItem {
  id: string;
  section: 'A' | 'B' | 'C';
  contentHtml: string;
  diagramUrl?: string;
}

interface ExamCreatorWorkspaceProps {
  projectTitle?: string;
  onSubmitForReview?: () => void;
}

export const ExamCreatorWorkspace: React.FC<ExamCreatorWorkspaceProps> = ({
  projectTitle = 'Pertengahan Tahun - Fizik F4',
  onSubmitForReview,
}) => {
  // Sidebar AI Generator Form State
  const [selectedTopic, setSelectedTopic] = useState('Chapter 5 - Wave');
  const [selectedStandard, setSelectedStandard] = useState(
    'Learning Standard: 5.2.1 Describe damping and resonance for an oscillating / vibrating system'
  );
  const [promptText, setPromptText] = useState(
    'Generate a 4-mark structured bilingual question regarding damping in a simple pendulum system.'
  );

  // Generated Preview State
  const [aiPreviewQuestion, setAiPreviewQuestion] = useState<string | null>(
    `A simple pendulum is displaced and left to oscillate in the air. It is observed that the amplitude of the oscillation decreases over time and eventually stops.
Satu bandul ringkas disesarkan dan dibiarkan berayun di udara. Diperhatikan bahawa amplitud ayunan semakin berkurang dengan masa dan akhirnya berhenti.

(a) State the phenomenon that causes the change in the amplitude of the oscillation.
Nyatakan fenomena yang menyebabkan perubahan pada amplitud ayunan tersebut.
[1 mark / 1 markah]

(b) Explain why the amplitude of the pendulum system decreases.
Terangkan mengapa amplitud sistem bandul itu berkurang.
[2 marks / 2 markah]

(c) State one method to enable the pendulum to continue oscillating with a constant amplitude.
Nyatakan satu kaedah untuk membolehkan bandul itu terus berayun dengan amplitud yang pemalar.
[1 mark / 1 markah]`
  );

  const [isGenerating, setIsGenerating] = useState(false);

  // Document Questions List
  const [sectionBQuestions, setSectionBQuestions] = useState<string[]>([]);

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setAiPreviewQuestion(
        `Generated Bilingual Question for ${selectedTopic}:\n\n(a) Explain the key characteristics based on ${selectedStandard}.\n[2 marks / 2 markah]`
      );
      setIsGenerating(false);
    }, 1200);
  };

  const handleAddQuestionToSectionB = () => {
    if (!aiPreviewQuestion) return;
    setSectionBQuestions([...sectionBQuestions, aiPreviewQuestion]);
  };

  return (
    <div className="workspace-wrapper">
      <header className="content-header">
        <h2>Teacher Dashboard</h2>
      </header>

      <div className="workspace-container">
        {/* Workspace Title & Top Action Bar */}
        <div className="workspace-top-bar">
          <h1 className="workspace-title">
            Exam Creator: <span>{projectTitle}</span>
          </h1>
          <button
            className="btn-submit-review"
            onClick={onSubmitForReview || (() => alert('Submitted to HOD for Review!'))}
          >
            Submit for Review
          </button>
        </div>

        {/* Workspace Grid: Left Document Canvas, Right AI Panel */}
        <div className="workspace-grid">
          {/* LEFT: Word Document Canvas */}
          <div className="document-canvas-scroll">
            <div className="document-page">
              {/* SECTION A */}
              <div className="doc-section">
                <h3 className="section-header-title">
                  Section A: Multiple Choice Questions (Objective)
                </h3>

                <div className="question-block">
                  <p className="question-text">
                    1. Rajah 1.1 menunjukkan sebuah bandul yang sedang berayun
                    apabila bandul disesarkan sebanyak 0.2m dari kedudukan
                    keseimbangan. Tempoh ayunan bandulan, T=0.5 s. Fenomena
                    pelembapan berlaku kepada ayunan bandul itu.
                  </p>

                  <div className="diagram-container">
                    {/* Placeholder SVG Diagram matching the pendulum illustration */}
                    <svg
                      width="180"
                      height="150"
                      viewBox="0 0 200 160"
                      className="diagram-svg"
                    >
                      <line x1="100" y1="10" x2="100" y2="20" stroke="#000" strokeWidth="3" />
                      <line x1="60" y1="20" x2="140" y2="20" stroke="#000" strokeWidth="2" />
                      {/* String & Bob */}
                      <line x1="100" y1="20" x2="100" y2="100" stroke="#000" strokeWidth="1.5" strokeDasharray="3 3" />
                      <line x1="100" y1="20" x2="70" y2="90" stroke="#000" strokeWidth="1.5" />
                      <line x1="100" y1="20" x2="130" y2="90" stroke="#000" strokeWidth="1.5" />
                      <circle cx="100" cy="100" r="7" fill="#000" />
                      {/* Distance indicator */}
                      <line x1="70" y1="80" x2="100" y2="80" stroke="#000" strokeWidth="1" />
                      <text x="80" y="75" fontSize="10">0.2m</text>
                      <text x="85" y="130" fontSize="11" fontWeight="bold">Rajah 1.1</text>
                      <text x="83" y="142" fontSize="10" fontStyle="italic">Diagram 1.1</text>
                    </svg>
                  </div>

                  <p className="question-text">Berdasarkan Rajah 1.1,</p>
                  <p className="subquestion-text">
                    a) Apakah kuantiti fizik yang berkurang apabila pelembapan berlaku?
                  </p>
                  <p className="instruction-text">Tandakan (/) pada jawapan yang betul.</p>

                  <div className="mcq-checkbox-group">
                    <label className="checkbox-option">
                      <input type="checkbox" disabled /> [ &nbsp; ] Amplitud ayunan
                    </label>
                    <label className="checkbox-option">
                      <input type="checkbox" disabled /> [ &nbsp; ] Frekuensi ayunan
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION B */}
              <div className="doc-section">
                <h3 className="section-header-title">
                  Section B: Structured Questions (Subjektif)
                </h3>

                {sectionBQuestions.length === 0 ? (
                  <div className="empty-drop-slot">
                    Empty Slot - Drop question here
                  </div>
                ) : (
                  sectionBQuestions.map((qText, idx) => (
                    <div key={idx} className="question-block inserted-question">
                      <p className="question-number">Question {idx + 1}:</p>
                      <pre className="question-content-preview">{qText}</pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: AI Question Generator Panel */}
          <div className="ai-sidebar-panel">
            <div className="form-group-ai">
              <label>TOPIC</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option>Chapter 5 - Wave</option>
                <option>Chapter 1 - Measurement</option>
                <option>Chapter 2 - Force and Motion I</option>
              </select>
            </div>

            <div className="form-group-ai">
              <label>LEARNING STANDARD</label>
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
              >
                <option>
                  Learning Standard: 5.2.1 Describe damping and resonance for an oscillating / vibrating system
                </option>
                <option>
                  Learning Standard: 5.1.2 Define amplitude, period, and frequency
                </option>
              </select>
            </div>

            <div className="form-group-ai">
              <label>PROMPT</label>
              <textarea
                rows={3}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe what kind of question to generate..."
              />
            </div>

            <button
              className="btn-generate-ai"
              onClick={handleGenerateAI}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating Question...' : 'Generate AI Question'}
            </button>

            {/* Preview Output Box */}
            <div className="ai-preview-box">
              <h4 className="preview-title">
                Preview: AI-Generated Output (Physics Form 4)
              </h4>

              {aiPreviewQuestion ? (
                <pre className="preview-text-content">{aiPreviewQuestion}</pre>
              ) : (
                <p className="no-preview-text">
                  No preview generated yet. Fill in the options above and click "Generate AI Question".
                </p>
              )}

              {aiPreviewQuestion && (
                <button
                  className="btn-add-section-b"
                  onClick={handleAddQuestionToSectionB}
                >
                  <span className="plus-icon">+</span> Add to Section B
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};