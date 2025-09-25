// import React, { useState, useEffect } from "react";
// import { db } from "../../services/db";
// import { useLocation, useParams } from "react-router-dom";
// import { getAssessmentById } from "../../services/assessments";
// import AssessmentPreview from "./AssessmentPreview";
// import SectionEditor from "./Builder/SectionEditor";

// export default function AssessmentBuilder() {
//   const location = useLocation();
//   const job = location.state?.job;
//   const { jobId } = useParams();

//   const [title, setTitle] = useState("");
//   const [sections, setSections] = useState([]);

//   useEffect(() => {
//     (async () => {
//       const data = await getAssessmentById(jobId);
//       if (data) {
//         setTitle(data.title || "");
//         setSections(data.sections || []);
//       }
//     })();
//   }, [jobId]);

//   const addSection = () => {
//     setSections([...sections, { id: Date.now(), title: "Untitled Section", questions: [] }]);
//   };

//   const updateSection = (secId, newSec) => {
//     setSections(sections.map((s) => (s.id === secId ? newSec : s)));
//   };

//   const saveAssessment = async () => {
//     if (!job) {
//       alert("⚠️ No job provided!");
//       return;
//     }
//     const id = await db.assessments.add({ jobId: job.id, title, sections });
//     alert(`Assessment saved with ID ${id} for job ${job.title}`);
//   };

// return (
//   <div className="grid grid-cols-2 gap-10 p-4 min-h-screen p-8 bg-[var(--color-dashboard-bg)] text-[var(--color-text)]">
//     <div>
//       <h2 className="text-xl font-bold mb-2">Assessment Builder</h2>
//       <input
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="border rounded px-2 py-1 mb-3 w-full"
//         placeholder="Assessment Title"
//       />

//       {/* ✅ Buttons row with gap */}
//       <div className="flex gap-4 mb-4">
//         <button
//           onClick={addSection}
//           className="bg-blue-500 text-white px-3 py-1 rounded"
//         >
//           + Section
//         </button>

//         <button
//           onClick={saveAssessment}
//           className="bg-green-500 text-white px-3 py-1 rounded"
//         >
//           Save Assessment
//         </button>
//       </div>

//       {/* Sections */}
//       {sections.map((sec) => (
//         <SectionEditor
//           key={sec.id}
//           section={sec}
//           onUpdate={(newSec) => updateSection(sec.id, newSec)}
//         />
//       ))}
//     </div>

//     <AssessmentPreview title={title} sections={sections} />
//   </div> 
// );

// }

// src/pages/Assessments/AssessmentBuilder.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../services/db";
import { useLocation, useParams } from "react-router-dom";
import { getAssessmentById } from "../../services/assessments";
import AssessmentPreview from "./AssessmentPreview";
import SectionEditor from "./Builder/SectionEditor";

export default function AssessmentBuilder() {
  const location = useLocation();
  const job = location.state?.job;
  const { jobId } = useParams();

  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getAssessmentById(jobId);
      console.log("asssss: ",data)
      if (data) {
        setTitle(data.title || "");
        setSections(data.sections || []);
      }
    })();
  }, [jobId]);

  const addSection = () => {
    setSections([
      ...sections,
      { id: Date.now(), title: "Untitled Section", questions: [] },
    ]);
  };

  const updateSection = (secId, newSec) => {
    setSections(sections.map((s) => (s.id === secId ? newSec : s)));
  };

  const saveAssessment = async () => {
    if (!job) {
      alert(" No job provided!");
      return;
    }
    const id = await db.assessments.add({ jobId: job.id, title, sections });
    alert(`Assessment saved with ID ${id} for job ${job.title}`);
  };

  return (
    <div className="grid grid-cols-2 gap-8 p-8 bg-[var(--color-dashboard-bg)] min-h-screen text-[var(--color-text)]">
      {/* Builder Box */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">
           Assessment Builder
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-3 py-2 mb-4 w-full"
          placeholder="Assessment Title"
        />

        <div className="flex gap-4 mb-6">
          <button
            onClick={addSection}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Section
          </button>
          <button
            onClick={saveAssessment}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save Assessment
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((sec) => (
            <SectionEditor
              key={sec.id}
              section={sec}
              onUpdate={(newSec) => updateSection(sec.id, newSec)}
            />
          ))}
        </div>
      </div>

      {/* Preview Box */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <AssessmentPreview title={title} sections={sections} />
      </div>
    </div>
  );
}
