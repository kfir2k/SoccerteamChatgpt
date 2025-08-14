import React, { useEffect, useMemo, useRef, useState } from "react";
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

  // 1) Read the real image aspect ratio once
  const [ratio, setRatio] = useState(9 / 16);
  useEffect(() => {
    const img = new Image();
    img.src = pitch;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight)
        setRatio(img.naturalWidth / img.naturalHeight);
    };
  }, []);

  // 2) Compute a box that never exceeds width OR height limits
  //    width <= 96vw (capped at 1040px)
  //    height <= min(90% of visual viewport height, visualHeight - 160px)
  const [box, setBox] = useState({ width: 320, height: 320 / (9 / 16) });
  const recalc = useMemo(() => {
    return () => {
      const vw = window.visualViewport?.width || window.innerWidth;
      const vh = window.visualViewport?.height || window.innerHeight;
      const maxW = Math.min(1040, vw * 0.96);
      const maxH = Math.max(260, Math.min(vh * 0.9, vh - 160));
      // Candidate width if we try to use the max height
      const wFromH = ratio * maxH;
      const width = Math.min(maxW, wFromH);
      const height = width / ratio;
      setBox({ width, height });
    };
  }, [ratio]);

  useEffect(() => {
    recalc();
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [recalc]);

  return (
    <div className="field-wrap">
      <div
        className="field"
        ref={(el) => {
          setNodeRef(el);
          if (fieldRef) fieldRef.current = el;
        }}
        style={{
          width: box.width + "px",
          height: box.height + "px",
          backgroundImage: `url(${pitch})`,
          backgroundSize: "100% 100%", // contain exactly, no cropping
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          maxWidth: "96vw", // extra safety for very small gutters
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
