
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssessmentById } from "../../services/assessments";

export default function AssessmentRuntime() {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      const data = await getAssessmentById(assessmentId);
      if (data) setAssessment(data);
    })();
  }, [assessmentId]);

  const setValue = (qid, val) => {
    setAnswers({ ...answers, [qid]: val });
  };

  const validate = () => {
    const errs = {};

    assessment.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        if (q.showIf && answers[q.showIf.questionId] !== q.showIf.equals) return;

        // Base validation
        if (q.required && !answers[q.id]) {
          errs[q.id] = "This field is required";
        }

        // Numeric validation
        if (q.type === "numeric") {
          const val = Number(answers[q.id]);
          if (isNaN(val)) errs[q.id] = "Must be a number";
          if (q.min != null && val < q.min) errs[q.id] = `Must be ≥ ${q.min}`;
          if (q.max != null && val > q.max) errs[q.id] = `Must be ≤ ${q.max}`;
        }

        // Text max length
        if (q.maxLength && answers[q.id]?.length > q.maxLength) {
          errs[q.id] = `Max length ${q.maxLength} exceeded`;
        }

        // Choice-based validation
        if ((q.type === "single-choice" || q.type === "multi-choice") && q.options) {
          q.options.forEach((opt) => {
            if (opt.showIf && answers[opt.showIf.questionId] !== opt.showIf.equals) {
              return; // skip hidden option
            }

            const selected =
              q.type === "single-choice"
                ? answers[q.id] === opt.label
                : (answers[q.id] || []).includes(opt.label);

            if (opt.required && !selected) {
              errs[q.id] = "This option is required";
            }

            if (selected && q.type === "single-choice") {
              if (opt.min != null && answers[q.id]?.length < opt.min) {
                errs[q.id] = `Must be at least ${opt.min}`;
              }
              if (opt.max != null && answers[q.id]?.length > opt.max) {
                errs[q.id] = `Must be ≤ ${opt.max}`;
              }
              if (opt.maxLength && answers[q.id]?.length > opt.maxLength) {
                errs[q.id] = `Max length ${opt.maxLength} exceeded`;
              }
            }
          });
        }
      });
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("✅ Form submitted: " + JSON.stringify(answers, null, 2));
    }
  };

  if (!assessment) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">{assessment.title}</h2>
      {assessment.job && (
        <p className="text-gray-600">
          For Job: {assessment.job.title} ({assessment.job.location})
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {assessment.sections.map((sec) => (
          <div key={sec.id} className="border rounded p-3">
            <h4 className="font-semibold">{sec.title}</h4>

            {sec.questions.map((q) => {
              if (q.showIf && answers[q.showIf.questionId] !== q.showIf.equals) return null;

              return (
                <div key={q.id} className="mt-2">
                  <label className="block mb-1">
                    {q.text}
                    {q.required && "*"}
                  </label>

                  {/* Short Text */}
                  {q.type === "short-text" && (
                    <input
                      type="text"
                      value={answers[q.id] || ""}
                      maxLength={q.maxLength || undefined}
                      onChange={(e) => setValue(q.id, e.target.value)}
                      className="border px-2 py-1 w-full"
                    />
                  )}

                  {/* Long Text */}
                  {q.type === "long-text" && (
                    <textarea
                      rows="3"
                      value={answers[q.id] || ""}
                      maxLength={q.maxLength || undefined}
                      onChange={(e) => setValue(q.id, e.target.value)}
                      className="border w-full"
                    />
                  )}

                  {/* Numeric */}
                  {q.type === "numeric" && (
                    <input
                      type="number"
                      min={q.min}
                      max={q.max}
                      value={answers[q.id] || ""}
                      onChange={(e) => setValue(q.id, e.target.value)}
                      className="border px-2 py-1"
                    />
                  )}

                  {/* Single Choice */}
                  {q.type === "single-choice" &&
                    q.options.map((opt, idx) => {
                      if (opt.showIf && answers[opt.showIf.questionId] !== opt.showIf.equals) {
                        return null;
                      }
                      return (
                        <label key={idx} className="block text-sm">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={answers[q.id] === opt.label}
                            onChange={() => setValue(q.id, opt.label)}
                          />{" "}
                          {opt.label}
                        </label>
                      );
                    })}

                  {/* Multi Choice */}
                  {q.type === "multi-choice" &&
                    q.options.map((opt, idx) => {
                      if (opt.showIf && answers[opt.showIf.questionId] !== opt.showIf.equals) {
                        return null;
                      }
                      return (
                        <label key={idx} className="block text-sm">
                          <input
                            type="checkbox"
                            checked={(answers[q.id] || []).includes(opt.label)}
                            onChange={(e) => {
                              const prev = answers[q.id] || [];
                              const newVal = e.target.checked
                                ? [...prev, opt.label]
                                : prev.filter((v) => v !== opt.label);
                              setValue(q.id, newVal);
                            }}
                          />{" "}
                          {opt.label}
                        </label>
                      );
                    })}

                  {/* File Upload */}
                  {q.type === "file-upload" && (
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setValue(q.id, {
                            name: file.name,
                            size: file.size,
                            type: file.type,
                          });
                        }
                      }}
                    />
                  )}

                  {errors[q.id] && (
                    <div className="text-red-600 text-sm">{errors[q.id]}</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
