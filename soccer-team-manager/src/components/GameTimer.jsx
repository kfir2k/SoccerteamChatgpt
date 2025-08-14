import React, { useState } from "react";
import { formatSeconds } from "../utils/timeUtils";

export default function GameTimer({ currentTime, gameDuration, onAddTime }) {
  const [showAddTime, setShowAddTime] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(1);

  const remain = Math.max(0, Math.floor(gameDuration - currentTime));

  const handleAddTime = (minutes) => {
    if (onAddTime) {
      onAddTime(minutes * 60); // Convert minutes to seconds
    }
    setShowAddTime(false);
  };

  return (
    <div className="timer-overlay">
      <div style={{ fontSize: 20 }}>{formatSeconds(currentTime)}</div>
      <div className="subtimer">({formatSeconds(remain)})</div>

      {/* Add Time Controls */}
      <div className="timer-controls">
        {!showAddTime ? (
          <button
            className="timer-btn"
            onClick={() => setShowAddTime(true)}
            title="Add extra time"
          >
            +⏰
          </button>
        ) : (
          <div className="add-time-panel">
            <div className="quick-add">
              <button
                className="timer-btn small"
                onClick={() => handleAddTime(1)}
              >
                +1m
              </button>
              <button
                className="timer-btn small"
                onClick={() => handleAddTime(5)}
              >
                +5m
              </button>
            </div>
            <div className="custom-add">
              <input
                type="number"
                min="1"
                max="30"
                value={customMinutes}
                onChange={(e) =>
                  setCustomMinutes(parseInt(e.target.value || "1", 10))
                }
                className="timer-input"
              />
              <button
                className="timer-btn small"
                onClick={() => handleAddTime(customMinutes)}
              >
                Add
              </button>
            </div>
            <button
              className="timer-btn small cancel"
              onClick={() => setShowAddTime(false)}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
