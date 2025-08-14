import React, { useEffect, useState } from "react";

const POSITIONS = [
  "GK",
  "CB",
  "LB",
  "RB",
  "CDM",
  "CM",
  "CAM",
  "RM",
  "LM",
  "RW",
  "LW",
  "ST",
];

export default function PlayerForm({ onCancel, onSave, initial }) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("CM");
  const [shirtNumber, setShirtNumber] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setPosition(initial.position || "CM");
      setShirtNumber(initial.shirtNumber || "");
    }
  }, [initial]);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{initial ? "Edit Player (Bench only)" : "Add Player"}</h3>
        <div className="row">
          <label>Name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="row">
          <label>Position</label>
          <select
            className="select"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="row">
          <label>Shirt Number (optional)</label>
          <input
            className="input"
            type="number"
            value={shirtNumber}
            onChange={(e) => setShirtNumber(e.target.value)}
          />
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn primary"
            onClick={() =>
              onSave({
                name: name.trim(),
                position,
                shirtNumber: shirtNumber ? Number(shirtNumber) : undefined,
              })
            }
          >
            {initial ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
