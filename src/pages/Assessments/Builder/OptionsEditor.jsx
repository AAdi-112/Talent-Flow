

import React from "react";

export default function OptionsEditor({ options, onChange }) {
  const updateOption = (idx, field, val) => {
    const newOpts = [...options];
    newOpts[idx] = { ...newOpts[idx], [field]: val };
    onChange(newOpts);
  };

  const removeOption = (idx) => {
    onChange(options.filter((_, i) => i !== idx));
  };

  const addOption = () => {
    onChange([
      ...options,
      {
        label: `Option ${options.length + 1}`,
        required: false,
        min: null,
        max: null,
        maxLength: null,
        showIf: null, // { questionId, equals }
      },
    ]);
  };

  return (
    <div className="ml-3">
      <h5 className="text-sm font-semibold">Options</h5>

      {options.map((opt, idx) => (
        <div key={idx} className="border p-2 mb-2 rounded bg-gray-50">
          {/* Option Label */}
          <div className="flex gap-2 items-center mb-1">
            <input
              value={opt.label || ""}
              placeholder={`Option ${idx + 1}`}
              onChange={(e) => updateOption(idx, "label", e.target.value)}
              className="border px-1 py-0.5 flex-1"
            />
            <button
              type="button"
              onClick={() => removeOption(idx)}
              className="bg-red-500 text-white px-2 rounded"
            >
              ✕
            </button>
          </div>

          {/* Validation Controls */}
          <div className="flex flex-wrap gap-3 text-xs mb-2">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={opt.required || false}
                onChange={(e) => updateOption(idx, "required", e.target.checked)}
              />
              Required
            </label>

            <label>
              Min:
              <input
                type="number"
                value={opt.min ?? ""}
                onChange={(e) => updateOption(idx, "min", e.target.value ? Number(e.target.value) : null)}
                className="border ml-1 w-16"
              />
            </label>

            <label>
              Max:
              <input
                type="number"
                value={opt.max ?? ""}
                onChange={(e) => updateOption(idx, "max", e.target.value ? Number(e.target.value) : null)}
                className="border ml-1 w-16"
              />
            </label>

            <label>
              Max Length:
              <input
                type="number"
                value={opt.maxLength ?? ""}
                onChange={(e) => updateOption(idx, "maxLength", e.target.value ? Number(e.target.value) : null)}
                className="border ml-1 w-16"
              />
            </label>
          </div>

          {/* Conditional Logic */}
          <div className="text-xs text-gray-700">
            <label>
              Show Question if selected:
              <input
                type="text"
                placeholder="Target Question ID"
                value={opt.showIf?.questionId || ""}
                onChange={(e) =>
                  updateOption(idx, "showIf", {
                    ...opt.showIf,
                    questionId: e.target.value,
                    equals: opt.label,
                  })
                }
                className="border ml-1 px-1 py-0.5 w-32"
              />
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addOption}
        className="bg-gray-300 px-2 py-1 rounded text-xs"
      >
        + Add Option
      </button>
    </div>
  );
}
