import React from "react";

export default function TimesToggle({ show, setShow }) {
  return (
    <button className="btn ghost" onClick={() => setShow((s) => !s)}>
      ⏱️ Times {show ? "ON" : "OFF"}
    </button>
  );
}
