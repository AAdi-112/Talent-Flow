

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateCandidateStage } from "./candidate.api";

const STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"];
const PAGE_SIZE = 50;

export default function PipelineBoard() {
  const [grouped, setGrouped] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const navigate = useNavigate();

  const sensors = useSensors(useSensor(PointerSensor));

  // fetch candidates for current page
  useEffect(() => {
    const fetchAll = async () => {
      const res = await fetch(`/api/candidates?page=${page}&limit=${PAGE_SIZE}`);
      const body = await res.json();
      console.log("[PipelineBoard] API response:", body);
      const byStage = {};
      STAGES.forEach((s) => (byStage[s] = []));
      (body.candidates || []).forEach((c) => {
        if (byStage[c.stage]) byStage[c.stage].push(c);
      });
      // console.log(byStage)

      setTotalPages(body.totalPages || 1);
      setGrouped(byStage);
    };
    fetchAll();
  }, [page]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // const handleDragOver = (event) => {
  //   const { active, over } = event;
  //   if (!over) return;

  //   const activeContainer = findContainer(grouped, active.id);
  //   const overContainer = findContainer(grouped, over.id) || over.id;

  //   if (!activeContainer || activeContainer === overContainer) return;

  //   setGrouped((prev) => {
  //     const next = { ...prev };
  //     let moved;
  //     const src = [...next[activeContainer]];
  //     const idx = src.findIndex((c) => `cand-${c.id}` === active.id);
  //     if (idx !== -1) {
  //       moved = src.splice(idx, 1)[0];
  //       next[activeContainer] = src;
  //     }
  //     if (moved) {
  //       next[overContainer] = [...next[overContainer], moved];
  //     }
  //     return next;
  //   });
  // };

  const handleDragOver = (event) => {
  const { active, over } = event;

  console.log("🟡 Drag Over Event:", { active, over });

  if (!over) {
    console.warn("⚠️ No drop target while dragging over.");
    return;
  }

  const activeContainer = findContainer(grouped, active.id);
  const overContainer = findContainer(grouped, over.id) || over.id;

  console.log("📦 Containers:", { activeContainer, overContainer });

  if (!activeContainer) {
    console.warn("⚠️ Active container not found, skipping.");
    return;
  }

  if (activeContainer === overContainer) {
    console.log("🔄 Still in the same container:", activeContainer);
    return;
  }

  console.log("🚚 Moving candidate preview from:", activeContainer, "➡️ to:", overContainer);

  setGrouped((prev) => {
    const next = { ...prev };
    let moved;

    const src = [...next[activeContainer]];
    const idx = src.findIndex((c) => c.id === active.id);

    console.log("   🔍 Candidate index in source:", idx);

    if (idx !== -1) {
      moved = src.splice(idx, 1)[0];
      next[activeContainer] = src;
      console.log("   ✂️ Removed from source:", moved);
    }

    if (moved) {
      next[overContainer] = [...next[overContainer], moved];
      console.log("   ➕ Added to target container:", overContainer, moved);
    } else {
      console.warn("⚠️ No candidate moved, something’s off.");
    }

    // console.log("✅ New grouped state preview:", {
    //   [activeContainer]: next[activeContainer].map((c) => c.id),
    //   [overContainer]: next[overContainer].map((c) => c.id),
    // });

    return next;
  });
};

  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log("🎯 Drag End Event:", { active, over });
    setActiveId(null);
    if (!over) {
      console.warn("⚠️ No drop target found (drag canceled).");
      return;
    }

    const activeContainer = findContainer(grouped, active.id);
    const overContainer = findContainer(grouped, over.id);

    // console.log("📦 Containers:", { activeContainer, overContainer });

    // same container: reorder
    if (activeContainer && activeContainer === overContainer) {
      console.log("🔄 Reordering inside container:", activeContainer);

      setGrouped((prev) => {
        const items = [...prev[activeContainer]];
        const oldIndex = items.findIndex((c) => c.id === active.id);
        const newIndex = items.findIndex((c) => c.id === over.id);

        console.log("   ↔️ Indices:", { oldIndex, newIndex });

        if (oldIndex !== -1 && newIndex !== -1) {
          const [moved] = items.splice(oldIndex, 1);
          items.splice(newIndex, 0, moved);
          console.log("✅ Reordered items:", items.map((i) => i.id));
        } else {
          console.warn("⚠️ Invalid indices for reorder, skipping.");
        }

        return { ...prev, [activeContainer]: items };
      });
      return;
    }

    // update backend if moved to another column
    // console.log('dgxdgx',activeContainer , overContainer, activeContainer !== overContainer)
    if (activeContainer && overContainer && activeContainer !== overContainer) {
      console.log("🚚 Moving candidate between containers:", { from: activeContainer, to: overContainer, });

      const candId = parseInt(active.id.replace("cand-", ""), 10);
      console.log("   🆔 Candidate ID:", candId);

      const moved = grouped[activeContainer].find((c) => c.id === candId);
      // const moved = grouped[activeContainer];
      // console.log("moved before: ",moved)

      console.log("   ✅ Found candidate in new container:", moved);

      moved.stage = overContainer;
      moved.statusHistory = [
        ...(moved.statusHistory || []),
        { stage: overContainer, date: new Date().toISOString() },
      ];

      // console.log("   📜 Updated candidate object:", moved);
      // console.log("moved after: ",moved)

      setGrouped((prev) => {
        const next = { ...prev };
        // remove from old
        next[activeContainer] = next[activeContainer].filter((c) => c.id !== candId);
        // add to new
        next[overContainer] = [{ ...moved }, ...next[overContainer],];
        
      updateCandidateStage(candId, overContainer);
      return next;
    });
    } else {
      console.warn("⚠️ Candidate not found in new container, skipping update.");
    }
  }
  // };


// const handleDragEnd = async (event) => {
//   const { active, over } = event;

//   console.log("🎯 Drag End Event:", { active, over });

//   setActiveId(null);

//   if (!over) {
//     console.warn("⚠️ No drop target found.");
//     return;
//   }
  
//   const activeContainer = findContainer(grouped, active.id);
//   const overContainer = findContainer(grouped, over.id);
//   const candidate = active
//   console.log("📦 Containers in drag den:", { activeContainer, overContainer });
  
  

//   // Case 1: Reorder within the same container
//   if (activeContainer && activeContainer === overContainer) {
//     console.log("🔄 Reordering inside container:", activeContainer);

//     setGrouped((prev) => {
//       const items = [...prev[activeContainer]];
//       const oldIndex = items.findIndex((c) => `cand-${c.id}` === active.id);
//       const newIndex = items.findIndex((c) => `cand-${c.id}` === over.id);

//       if (oldIndex !== -1 && newIndex !== -1) {
//         const [moved] = items.splice(oldIndex, 1);
//         items.splice(newIndex, 0, moved);
//         console.log("✅ Reordered items:", items.map((i) => i.id));
//       }

//       return { ...prev, [activeContainer]: items };
//     });

//     return;
//   }

//   // Case 2: Move between containers
//   if (activeContainer && overContainer && activeContainer !== overContainer) {
//     console.log("🚚 Moving candidate between containers:", {
//       from: activeContainer,
//       to: overContainer,
//     });

//     const candId = parseInt(active.id.replace("cand-", ""), 10);

//     // Find candidate in active container
//     const candidate = grouped[activeContainer]?.find((c) => c.id === candId);

//     if (!candidate) {
//       console.warn("⚠️ Candidate not found in active container.");
//       return;
//     }

//     // Use helper to update state + backend
//   }
// };

  const filteredGrouped = {};
  STAGES.forEach((stage) => {
    filteredGrouped[stage] = (grouped[stage] || []).filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Candidate Job Board</h2>
        <input
          type="text"
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-6 gap-4">
          {STAGES.map((stage) => (
            <Column
              key={stage}
              id={stage}
              items={filteredGrouped[stage]}
              navigate={navigate}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? <Item id={activeId} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// helpers
// function findContainer(state, id) {
//   console.log("State: ",state,id)
//   return Object.keys(state).find((key) =>
//     state[key].some((c) => c.id === id)
//   );
// }

function findContainer(state, id) {
  console.log("State: ", state, "Looking for:", id);

  // Normalize id:
  let normalizedId = parseInt(id, 10);
  // Search through containers
  const container = Object.keys(state).find((key) =>
    state[key].some((c) => c.id === normalizedId)
  );

  console.log("🔍 Normalized ID:", normalizedId, "📦 Found in container:", container);
  return container;
}

function Column({ id, items, navigate }) {
  const { setNodeRef } = useDroppable({ id: `stage-${id}` });
  const droppableRef = items.length === 0 ? setNodeRef : null;

    const stageColors = {
    applied: "bg-lime-100",
    screen: "bg-yellow-100",
    tech: "bg-green-100",
    offer: "bg-teal-100",
    hired: "bg-emerald-100",
    rejected: "bg-red-100",
  };

  return (
    <div
      ref={droppableRef}
      id={`stage-${id}`}
      className={`flex flex-col min-h-[500px] rounded-lg shadow-sm p-2 ${
        stageColors[id] || "bg-gray-100"
      }`}
    >
      <h4 className="font-semibold mb-2 capitalize text-center">
        {id} ({items.length})
      </h4>

      <SortableContext
        items={items.map((c) => `${c.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((c) => (
          <SortableItem key={`s${c.id}`} candidate={c} navigate={navigate} />
        ))}
        {items.length === 0 && <div style={{ minHeight: 40 }} />}
      </SortableContext>
    </div>
  );
}

function SortableItem({ candidate, navigate }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `${candidate.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="p-3 border rounded bg-white shadow hover:shadow-md flex items-center justify-between cursor-pointer mb-2 "
      ref={setNodeRef}
      style={style}
      {...attributes}
      
    >
      <div onClick={() => navigate(`/candidates/${candidate.id}`)}>
        <div className="font-medium">{candidate.name}</div>
        <div className="text-sm text-gray-500">{candidate.email}</div>
        <div className="text-xs text-gray-400 italic">
          Stage: {candidate.stage}
        </div>
      </div>
      <div {...listeners} className="cursor-grab pl-2 text-gray-400 hover:text-gray-600">
        ☰
      </div>
    </div>
  );
}

function Item({ id }) {
  return (
    <div
      style={{
        padding: "8px",
        margin: "4px 0",
        border: "1px solid #24a20aff",
        borderRadius: "4px",
        background: "#73c263ff",
      }}
    >
      {id}
    </div>
  );
}
