// // App.jsx
// import React, {useState} from 'react';
// import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';

// export default function Test() {
//   // items grouped by container id
//   const [containers, setContainers] = useState({
//     A: ['a1', 'a2', 'a3','a4'],
//     B: ['b1'],
//     C: ['c1'],
//   });

//   return (
//     <DndContext onDragEnd={handleDragEnd}>
//       <div style={{display: 'flex', gap: 16}}>
//         {Object.keys(containers).map((id) => (
//           <Droppable key={id} id={id}>
//             <h3>Container {id}</h3>
//             {containers[id].map((itemId) => (
//               <Draggable key={itemId} id={itemId}>
//                 <div style={{
//                   padding: 8,
//                   margin: '6px 0',
//                   background: '#fff',
//                   border: '1px solid #ddd',
//                 }}>
//                   {itemId}
//                 </div>
//               </Draggable>
//             ))}
//             {containers[id].length === 0 && (
//               <div style={{padding: 8, color: '#888'}}>Drop here</div>
//             )}
//           </Droppable>
//         ))}
//       </div>
//     </DndContext>
//   );

//   function handleDragEnd(event) {
//     const {active, over} = event;

//     // If dropped over a container, move item to that container
//     if (over) {
//       const sourceContainerId = findContainerContaining(active.id);
//       const destContainerId = over.id;

//       if (sourceContainerId && destContainerId && sourceContainerId !== destContainerId) {
//         setContainers((prev) => {
//           const sourceItems = prev[sourceContainerId].filter(id => id !== active.id);
//           const destItems = [...prev[destContainerId], active.id];

//           return {
//             ...prev,
//             [sourceContainerId]: sourceItems,
//             [destContainerId]: destItems,
//           };
//         });
//       }
//     }
//   }

//   function findContainerContaining(itemId) {
//     return Object.keys(containers).find((key) => containers[key].includes(itemId)) || null;
//   }
// }



// // Droppable.jsx

//  function Droppable({id, children}) {
//   const {isOver, setNodeRef} = useDroppable({id});
//   const style = {
//     minWidth: 200,
//     minHeight: 120,
//     padding: 12,
//     border: '2px dashed #bbb',
//     background: isOver ? '#f0fff0' : '#fafafa',
//   };

//   return (
//     <div ref={setNodeRef} style={style}>
//       {children}
//     </div>
//   );
// }


// // Draggable.jsx
// import {CSS} from '@dnd-kit/utilities';

//  function Draggable({id, children}) {
//   const {attributes, listeners, setNodeRef, transform} = useDraggable({id});
//   const style = {
//     transform: transform ? CSS.Translate.toString(transform) : undefined,
//     touchAction: 'none',
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
//       {children}
//     </div>
//   );
// }

// // App.jsx
// import React, {useState} from 'react';
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   KeyboardSensor,
//   useSensor,
//   useSensors,
//   DragOverlay,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   arrayMove,
//   verticalListSortingStrategy,
//   sortableKeyboardCoordinates,
// } from '@dnd-kit/sortable';


// export default function Test() {
//   const [containers, setContainers] = useState({
//     left: ['a', 'b', 'c'],
//     right: ['d', 'e'],
//   });
//   const [activeId, setActiveId] = useState(null);
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
//   );

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragStart={handleDragStart}
//       onDragOver={handleDragOver}
//       onDragEnd={handleDragEnd}
//     >
//       <div style={{display: 'flex', gap: 16}}>
//         <Column id="left" items={containers.left} />
//         <Column id="right" items={containers.right} />
//       </div>

//       <DragOverlay>
//         {activeId ? <Item id={activeId} /> : null}
//       </DragOverlay>
//     </DndContext>
//   );

//   function handleDragStart(event) {
//     setActiveId(event.active.id);
//   }

//   function handleDragOver(event) {
//     const {active, over} = event;
//     if (!over) return;

//     // over.id will be either an item id or a droppable container id.
//     const activeContainer = findContainer(containers, active.id);
//     const overContainer = findContainer(containers, over.id) || over.id;

//     if (!activeContainer || activeContainer === overContainer) return;

//     // remove from source and insert into destination at end while dragging
//     setContainers(prev => {
//       const sourceItems = [...prev[activeContainer]];
//       const destItems = [...prev[overContainer]];

//       // remove item from source
//       const index = sourceItems.indexOf(active.id);
//       if (index > -1) sourceItems.splice(index, 1);

//       // insert at end (or compute specific index from over if over is item)
//       destItems.push(active.id);

//       return {
//         ...prev,
//         [activeContainer]: sourceItems,
//         [overContainer]: destItems,
//       };
//     });
//   }

//   function handleDragEnd(event) {
//     const {active, over} = event;
//     setActiveId(null);
//     if (!over) return;

//     const activeContainer = findContainer(containers, active.id);
//     const overContainer = findContainer(containers, over.id);

//     // same container: reorder
//     if (activeContainer && activeContainer === overContainer) {
//       setContainers(prev => {
//         const items = [...prev[activeContainer]];
//         const oldIndex = items.indexOf(active.id);
//         const newIndex = items.indexOf(over.id);
//         items.splice(oldIndex, 1);
//         items.splice(newIndex, 0, active.id);
//         return {...prev, [activeContainer]: items};
//       });
//       return;
//     }

//     // moved to different container: already inserted in onDragOver for this example.
//     // If you prefer to finalize move only on drag end, implement the splice logic here.
//   }

//   function findContainer(state, id) {
//     return Object.keys(state).find(key => state[key].includes(id));
//   }
// }

// // Column.jsx
// function Column({id, items}) {
//   return (
//     <div style={{minWidth: 200, padding: 8, border: '1px solid #ddd'}}>
//       <h4>{id}</h4>

//       {/* droppable wrapper for empty container: use the container id as SortableContext items */}
//       <SortableContext items={items} strategy={verticalListSortingStrategy}>
//         {items.map(itemId => (
//           <SortableItem key={itemId} id={itemId} />
//         ))}

//         {/* If the column is empty, render a placeholder droppable area so it can accept drops */}
//         {items.length === 0 && <div style={{minHeight: 40}} />}
//       </SortableContext>
//     </div>
//   );
// }
// function SortableItem({item}){
//     return <div>{item}</div>
// }




// App.jsx
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Test() {
  const [containers, setContainers] = useState({
    left: ["a", "b", "c"],
    right: ["d", "e"],
    centre: ["f", "g"],
  });
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: "flex", gap: 16 }}>
        <Column id="left" items={containers.left} />
        <Column id="right" items={containers.right} />
        <Column id="centre" items={containers.centre} />
      </div>

      <DragOverlay>
        {activeId ? <Item id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(containers, active.id);
    const overContainer = findContainer(containers, over.id) || over.id;

    if (!activeContainer || activeContainer === overContainer) return;

    setContainers((prev) => {
      const sourceItems = [...prev[activeContainer]];
      const destItems = [...prev[overContainer]];

      const index = sourceItems.indexOf(active.id);
      if (index > -1) sourceItems.splice(index, 1);

      destItems.push(active.id);

      return {
        ...prev,
        [activeContainer]: sourceItems,
        [overContainer]: destItems,
      };
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeContainer = findContainer(containers, active.id);
    const overContainer = findContainer(containers, over.id);

    if (activeContainer && activeContainer === overContainer) {
      setContainers((prev) => {
        const items = [...prev[activeContainer]];
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        items.splice(oldIndex, 1);
        items.splice(newIndex, 0, active.id);
        return { ...prev, [activeContainer]: items };
      });
    }
  }

  function findContainer(state, id) {
    return Object.keys(state).find((key) => state[key].includes(id));
  }
}

// Column.jsx
function Column({ id, items }) {
    const { setNodeRef } = useDroppable({id})
    const droppableRef = items.length===0 ? setNodeRef : null
  return (
    <div ref={droppableRef} style={{ minWidth: 200, padding: 8, border: "1px solid #ddd" }}>
      <h4>{id}</h4>
      
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((itemId) => (
          <SortableItem key={itemId} id={itemId} />
        ))}
        {items.length === 0 && <div style={{ minHeight: 40 }} />}
      </SortableContext>
    </div>
  );
}

// SortableItem.jsx
function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "8px",
    margin: "4px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    background: "white",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
}

// Item.jsx (used for DragOverlay)
function Item({ id }) {
  return (
    <div
      style={{
        padding: "8px",
        margin: "4px 0",
        border: "1px solid #aaa",
        borderRadius: "4px",
        background: "lightgreen",
      }}
    >
      {id}
    </div>
  );
}
