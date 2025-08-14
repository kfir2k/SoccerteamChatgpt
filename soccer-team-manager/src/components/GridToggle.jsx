import React from "react";

export default function GridToggle({ show, setShow }) {
  return (
    <button className="btn ghost" onClick={() => setShow((s) => !s)}>
      🔳 Grid {show ? "ON" : "OFF"}
    </button>
  );
}
