import React from "react";
import { formatSeconds } from "../utils/timeUtils";

export default function GameTimer({ currentTime, gameDuration }) {
  const remain = Math.max(0, Math.floor(gameDuration - currentTime));
  return (
    <div className="timer-overlay">
      <div style={{ fontSize: 20 }}>{formatSeconds(currentTime)}</div>
      <div className="subtimer">({formatSeconds(remain)})</div>
    </div>
  );
}
