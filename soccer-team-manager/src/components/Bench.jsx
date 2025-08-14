import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { BenchCard } from "./PlayerCard.jsx";

export default function Bench({ players, onEdit, onDelete, onAddClick }) {
  const benchPlayers = players.filter((p) => !p.isOnField);
  const { setNodeRef } = useDroppable({ id: "bench" });

  return (
    <div className="bench" ref={setNodeRef}>
      <div className="bench-head">
        <div className="flex">
          <strong>BENCH – Club Roster</strong>
        </div>
        <button className="btn primary" onClick={onAddClick}>
          + Add
        </button>
      </div>
      <div className="bench-list">
        {benchPlayers.map((p) => (
          <BenchCard
            key={p.id}
            player={p}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
