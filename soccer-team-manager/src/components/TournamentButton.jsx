import React from "react";

export default function TournamentButton({
  isActive,
  onStart,
  onStop,
  openSetup,
}) {
  if (isActive) {
    return (
      <button className="btn warn" onClick={onStop}>
        Stop Tournament
      </button>
    );
  }
  return (
    <button className="btn" onClick={openSetup}>
      🏆 Tournament
    </button>
  );
}
