import React, { useState } from "react";

export default function TournamentSetup({ onCancel, onStart }) {
  const [minutes, setMinutes] = useState(90);
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Tournament Setup</h3>
        <div className="row">
          <label>Game Duration (minutes)</label>
          <input
            className="input"
            type="number"
            min="1"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value || "0", 10))}
          />
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn primary" onClick={() => onStart(minutes)}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
