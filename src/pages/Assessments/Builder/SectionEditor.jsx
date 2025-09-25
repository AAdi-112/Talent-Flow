import React from "react";
import QuestionEditor from "./QuestionEditor";

const QUESTION_TYPES = ["single-choice", "multi-choice", "short-text", "long-text", "numeric", "file-upload"];

export default function SectionEditor({ section, onUpdate }) {
  const updateSectionTitle = (title) => {
    onUpdate({ ...section, title });
  };

  const addQuestion = (type) => {
    const newQ = {
      id: Date.now(),
      type,
      text: "New Question",
      required: false,
      options: type.includes("choice") ? ["Option 1", "Option 2"] : [],
      min: type === "numeric" ? 0 : null,
      max: type === "numeric" ? 100 : null,
      showIf: null,
    };
    onUpdate({ ...section, questions: [...section.questions, newQ] });
  };

  const updateQuestion = (qId, newQ) => {
    onUpdate({
      ...section,
      questions: section.questions.map((q) => (q.id === qId ? newQ : q)),
    });
  };

  return (
    <div className="border rounded p-3 mb-3">
      <input
        value={section.title}
        onChange={(e) => updateSectionTitle(e.target.value)}
        className="border-b w-full mb-2"
      />

      <div className="flex gap-2 flex-wrap mb-2">
        {QUESTION_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => addQuestion(t)}
            className="bg-gray-200 px-2 py-1 rounded text-xs"
          >
            + {t}
          </button>
        ))}
      </div>

      {section.questions.map((q) => (
        <QuestionEditor
          key={q.id}
          question={q}
          onUpdate={(newQ) => updateQuestion(q.id, newQ)}
        />
      ))}
    </div>
  );
}
