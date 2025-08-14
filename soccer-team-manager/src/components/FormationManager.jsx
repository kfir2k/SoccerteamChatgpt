import React from "react";

export default function FormationManager({
  formations,
  selectedId,
  onSelect,
  onSaveClick,
  onDelete,
}) {
  return (
    <div className="flex">
      <label>Formation:</label>
      <select
        className="select"
        value={selectedId || ""}
        onChange={(e) => onSelect(e.target.value || null)}
      >
        <option value="">(Current)</option>
        {formations.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      <button className="btn" onClick={onSaveClick}>
        Save
      </button>
      <button className="btn warn" onClick={onDelete}>
        🗑️
      </button>
    </div>
  );
}
