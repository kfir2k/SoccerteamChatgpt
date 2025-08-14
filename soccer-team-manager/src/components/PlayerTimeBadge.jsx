import React from "react";
import { formatSeconds } from "../utils/timeUtils";

export default function PlayerTimeBadge({ seconds }) {
  const s = Math.floor(seconds || 0);
  const m = Math.floor(s / 60);
  let tone = "green";
  if (m >= 60) tone = "red";
  else if (m >= 40) tone = "orange";
  else if (m >= 20) tone = "yellow";
  return <div className={`badge ${tone}`}>{formatSeconds(s)}</div>;
}
