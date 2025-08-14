import React, { useEffect, useMemo, useState } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { PlayerDot } from "./PlayerCard.jsx";
import GameTimer from "./GameTimer.jsx";
import pitch from "../assets/pitch.jpg";

function DraggableFieldPlayer({ player, showTimes, px, py, dot }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: player.id,
      data: { from: "field", playerId: player.id, startX: px, startY: py },
    });
  const style = {
    position: "absolute",
    left: px,
    top: py,
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

export default function Field({
  players,
  fieldRef,
  showTimes,
  tournament,
  dotSize = 56,
}) {
  const fieldPlayers = players.filter((p) => p.isOnField);
  const { setNodeRef } = useDroppable({ id: "field" });

  // Read image aspect ratio once
  const [ratio, setRatio] = useState(9 / 16);
  useEffect(() => {
    const img = new Image();
    img.src = pitch;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight)
        setRatio(img.naturalWidth / img.naturalHeight);
    };
  }, []);

  // Compute a best-fit box that respects both width & height caps (prevents side-cuts on tall phones)
  const [box, setBox] = useState({ width: 320, height: 320 / (9 / 16) });
  const recalc = useMemo(() => {
    return () => {
      const vw = window.visualViewport?.width || window.innerWidth;
      const vh = window.visualViewport?.height || window.innerHeight;
      const maxW = Math.min(1040, vw * 0.96);
      const maxH = Math.max(260, Math.min(vh * 0.9, vh - 160));
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

  const areaW = Math.max(0, box.width - dotSize);
  const areaH = Math.max(0, box.height - dotSize);

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
          backgroundSize: "100% 100%", // no cropping
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          maxWidth: "96vw",
        }}
      >
        <div className="players-layer">
          {fieldPlayers.map((p) => {
            // Convert normalized to pixels (fallback to legacy pixel positions if needed)
            const hasPct =
              p.fieldPct &&
              typeof p.fieldPct.x === "number" &&
              typeof p.fieldPct.y === "number";
            const nx = hasPct
              ? p.fieldPct.x
              : areaW > 0
              ? (p.fieldPosition?.x || 0) / areaW
              : 0;
            const ny = hasPct
              ? p.fieldPct.y
              : areaH > 0
              ? (p.fieldPosition?.y || 0) / areaH
              : 0;
            const px = Math.max(0, Math.min(nx * areaW, areaW));
            const py = Math.max(0, Math.min(ny * areaH, areaH));
            return (
              <DraggableFieldPlayer
                key={p.id}
                player={p}
                showTimes={showTimes}
                px={px}
                py={py}
                dot={dotSize}
              />
            );
          })}
        </div>
        {tournament.isActive && (
          <GameTimer
            currentTime={tournament.currentTime}
            gameDuration={tournament.gameDuration}
            onAddTime={tournament.addTime}
          />
        )}
      </div>
    </div>
  );
}
