// import React from "react";

// export default function AssessmentPreview({ title, sections }) {
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-2">Live Preview</h2>
//       <form className="space-y-4">
//         <h3 className="text-lg font-semibold">{title}</h3>

//         {sections.map((sec) => (
//           <div key={sec.id} className="border rounded p-3">
//             <h4 className="font-semibold">{sec.title}</h4>

//             {sec.questions.map((q) => (
//               <div key={q.id} className="mt-2">
//                 <label className="block mb-1">
//                   {q.text}
//                   {q.required && " *"}
//                 </label>

//                 {/* Short text */}
//                 {q.type === "short-text" && (
//                   <input
//                     type="text"
//                     className="border px-2 py-1 w-full"
//                     maxLength={q.maxLength || undefined}
//                   />
//                 )}

//                 {/* Long text */}
//                 {q.type === "long-text" && (
//                   <textarea
//                     className="border w-full"
//                     rows="3"
//                     maxLength={q.maxLength || undefined}
//                   />
//                 )}

//                 {/* Numeric */}
//                 {q.type === "numeric" && (
//                   <input
//                     type="number"
//                     className="border px-2 py-1"
//                     min={q.min ?? undefined}
//                     max={q.max ?? undefined}
//                   />
//                 )}

//                 {/* Single choice */}
//                 {q.type === "single-choice" &&
//                   q.options.map((opt, idx) => (
//                     <label key={idx} className="block text-sm">
//                       <input
//                         type="radio"
//                         name={`q-${q.id}`}
//                         required={opt.required || false}
//                       />{" "}
//                       {opt.label}

//                       {/* show validation hints */}
//                       <span className="ml-2 text-xs text-gray-500">
//                         {opt.min != null && `Min: ${opt.min} `}
//                         {opt.max != null && `Max: ${opt.max} `}
//                         {opt.maxLength != null && `MaxLen: ${opt.maxLength} `}
//                         {opt.showIf &&
//                           ` (Shown if Q${opt.showIf.questionId} === ${opt.showIf.equals})`}
//                       </span>
//                     </label>
//                   ))}

//                 {/* Multi choice */}
//                 {q.type === "multi-choice" &&
//                   q.options.map((opt, idx) => (
//                     <label key={idx} className="block text-sm">
//                       <input
//                         type="checkbox"
//                         required={opt.required || false}
//                       />{" "}
//                       {opt.label}

//                       {/* show validation hints */}
//                       <span className="ml-2 text-xs text-gray-500">
//                         {opt.min != null && `Min: ${opt.min} `}
//                         {opt.max != null && `Max: ${opt.max} `}
//                         {opt.maxLength != null && `MaxLen: ${opt.maxLength} `}
//                         {opt.showIf &&
//                           ` (Shown if Q${opt.showIf.questionId} === ${opt.showIf.equals})`}
//                       </span>
//                     </label>
//                   ))}

//                 {/* File upload */}
//                 {q.type === "file-upload" && (
//                   <input type="file" disabled className="text-gray-500" />
//                 )}
//               </div>
//             ))}
//           </div>
//         ))}
//       </form>
//     </div>
//   );
// }



// src/pages/Assessments/AssessmentPreview.jsx
import React from "react";

export default function AssessmentPreview({ title, sections }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 border-b pb-2"> Live Preview</h2>
      <form className="space-y-6">
        <h3 className="text-lg font-semibold">{title || "Untitled Assessment"}</h3>

        {sections.length === 0 && (
          <p className="text-gray-500 italic">No sections added yet.</p>
        )}

        {sections.map((sec) => (
          <div
            key={sec.id}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <h4 className="font-semibold mb-2">{sec.title}</h4>

            {sec.questions.map((q) => (
              <div
                key={q.id}
                className="mt-3 p-3 border-b last:border-b-0"
              >
                <label className="block font-medium mb-1">
                  {q.text}
                  {q.required && " *"}
                </label>

                {q.type === "short-text" && (
                  <input
                    type="text"
                    className="border rounded px-2 py-1 w-full"
                    maxLength={q.maxLength || undefined}
                    placeholder="Type your answer..."
                  />
                )}

                {q.type === "long-text" && (
                  <textarea
                    className="border rounded px-2 py-1 w-full"
                    rows="3"
                    maxLength={q.maxLength || undefined}
                    placeholder="Type a longer answer..."
                  />
                )}

                {q.type === "numeric" && (
                  <input
                    type="number"
                    className="border rounded px-2 py-1"
                    min={q.min ?? undefined}
                    max={q.max ?? undefined}
                    placeholder="Enter number"
                  />
                )}

                {q.type === "single-choice" &&
                  q.options.map((opt, idx) => (
                    <label key={idx} className="block text-sm">
                      <input type="radio" name={`q-${q.id}`} /> {opt.label}
                    </label>
                  ))}

                {q.type === "multi-choice" &&
                  q.options.map((opt, idx) => (
                    <label key={idx} className="block text-sm">
                      <input type="checkbox" /> {opt.label}
                    </label>
                  ))}

                {q.type === "file-upload" && (
                  <input type="file" disabled className="text-gray-400" />
                )}
              </div>
            ))}
          </div>
        ))}
      </form>
    </div>
  );
}
