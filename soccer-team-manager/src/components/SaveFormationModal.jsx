import React, { useState } from "react";

export default function SaveFormationModal({ onCancel, onSave }) {
  const [name, setName] = useState("Starting XI");
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Save Formation</h3>
        <div className="row">
          <label>Formation Name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn primary"
            onClick={() => onSave(name.trim() || "Untitled")}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
