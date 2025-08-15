import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { BenchCard } from "./PlayerCard.jsx";

export default function Bench({
  players,
  onEdit,
  onDelete,
  onAddClick,
  isDragging,
}) {
  const benchPlayers = players.filter((p) => !p.isOnField);
  const { setNodeRef, isOver } = useDroppable({ id: "bench" });

  const showDropZone = isDragging;
  const isActiveDropZone = isDragging && isOver;

  return (
    <div
      className={`bench ${showDropZone ? "bench-drop-ready" : ""} ${
        isActiveDropZone ? "bench-drop-active" : ""
      }`}
      ref={setNodeRef}
    >
      <div className="bench-head">
        <div className="flex">
          <strong>BENCH – Club Roster</strong>
        </div>
        <button className="btn primary" onClick={onAddClick}>
          + Add
        </button>
      </div>

      {showDropZone && (
        <div
          className={`drop-zone-indicator ${
            isActiveDropZone ? "drop-zone-active" : ""
          }`}
        >
          <div className="drop-zone-content">
            <div className="drop-zone-icon">🏃‍♂️</div>
            <div className="drop-zone-text">
              {isActiveDropZone
                ? "Release to bench player"
                : "Drop zone for bench"}
            </div>
          </div>
        </div>
      )}

      <div
        className={`bench-list ${showDropZone ? "bench-list-dropping" : ""}`}
      >
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
