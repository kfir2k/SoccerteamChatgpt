import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { getPositionColor, initials } from "../utils/playerUtils";
import PlayerTimeBadge from "./PlayerTimeBadge.jsx";

export function PlayerDot({ player, showTimes }) {
  const color = getPositionColor(player.position);
  return (
    <div className="player-dot" style={{ background: color }}>
      <div className="player-initials">{initials(player.name)}</div>
      <div className="player-pos">{player.position}</div>
      {showTimes && <PlayerTimeBadge seconds={player.playingTime} />}
    </div>
  );
}

export function BenchCard({ player, onEdit, onDelete }) {
  const color = getPositionColor(player.position);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: player.id,
    data: { from: "bench", playerId: player.id },
  });
  return (
    <div
      className="card"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.6 : 1, touchAction: "none" }}
    >
      <div className="card-pos" style={{ background: color }}>
        {player.position}
      </div>
      <div className="card-main">
        <div className="card-name">
          {player.name} {player.shirtNumber ? `(#${player.shirtNumber})` : ""}
        </div>
        <div className="card-sub">
          Time: {Math.floor(player.playingTime / 60)}m
        </div>
      </div>
      <div className="card-actions">
        <button
          className="btn ghost"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(player);
          }}
        >
          ✏️
        </button>
        <button
          className="btn warn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(player.id);
          }}
        >
          ❌
        </button>
      </div>
    </div>
  );
}
