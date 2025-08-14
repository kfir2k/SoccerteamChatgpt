import React, { useEffect, useState } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { PlayerDot } from "./PlayerCard.jsx";
import GameTimer from "./GameTimer.jsx";
import pitch from "../assets/pitch.jpg";

function DraggableFieldPlayer({ player, showTimes }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: player.id,
      data: {
        from: "field",
        playerId: player.id,
        startX: player.fieldPosition.x,
        startY: player.fieldPosition.y,
      },
    });
  const style = {
    position: "absolute",
    left: player.fieldPosition.x,
    top: player.fieldPosition.y,
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    zIndex: isDragging ? 1000 : "auto",
    touchAction: "none",
  };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <PlayerDot player={player} showTimes={showTimes} />
    </div>
  );
}

export default function Field({ players, fieldRef, showTimes, tournament }) {
  const fieldPlayers = players.filter((p) => p.isOnField);
  const { setNodeRef } = useDroppable({ id: "field" });

  // Detect the real aspect ratio of the image so we NEVER crop touchlines
  const [aspect, setAspect] = useState("9 / 16");
  useEffect(() => {
    const img = new Image();
    img.src = pitch;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspect(`${img.naturalWidth} / ${img.naturalHeight}`);
      }
    };
  }, []);

  return (
    <div className="field-wrap">
      <div
        className="field"
        ref={(el) => {
          setNodeRef(el);
          if (fieldRef) fieldRef.current = el;
        }}
        style={{
          aspectRatio: aspect,
          backgroundImage: `url(${pitch})`,
          // Fit image EXACTLY to the container to avoid any cropping
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="players-layer">
          {fieldPlayers.map((p) => (
            <DraggableFieldPlayer key={p.id} player={p} showTimes={showTimes} />
          ))}
        </div>
        {tournament.isActive && (
          <GameTimer
            currentTime={tournament.currentTime}
            gameDuration={tournament.gameDuration}
          />
        )}
      </div>
    </div>
  );
}
