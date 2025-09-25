import React from "react";
import OptionsEditor from "./OptionsEditor";

export default function QuestionEditor({ question, onUpdate }) {
  return (
    <div className="mt-2 pl-2 border-l space-y-2">
      <input
        value={question.text}
        onChange={(e) => onUpdate({ ...question, text: e.target.value })}
        className="border-b w-full"
      />

      {(question.type === "single-choice" || question.type === "multi-choice") && (
        <OptionsEditor
          options={question.options}
          onChange={(opts) => onUpdate({ ...question, options: opts })}
        />
      )}

      {question.type === "numeric" && (
        <div className="flex gap-2 text-sm">
          <label>
            Min:
            <input
              type="number"
              value={question.min || ""}
              onChange={(e) => onUpdate({ ...question, min: Number(e.target.value) })}
              className="border ml-1 w-16"
            />
          </label>
          <label>
            Max:
            <input
              type="number"
              value={question.max || ""}
              onChange={(e) => onUpdate({ ...question, max: Number(e.target.value) })}
              className="border ml-1 w-16"
            />
          </label>
        </div>
      )}

      {question.type === "file-upload" && (
        <div className="text-sm text-gray-600">
          File upload will be shown in runtime.
        </div>
      )}
    </div>
  );
}
