import React, { useState } from "react";
import {
  exportFormationAsImage,
  exportFormationAsPDF,
} from "../utils/exportUtils";

export default function ExportButton({
  fieldRef,
  players,
  formations,
  selectedFormationId,
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const selectedFormation = formations.find(
    (f) => f.id === selectedFormationId
  );
  const formationName = selectedFormation?.name || "Current Formation";

  const handleExport = async (format) => {
    if (!fieldRef?.current) {
      alert("Field not ready for export");
      return;
    }

    setIsExporting(true);
    setShowExportMenu(false);

    try {
      const exportData = {
        fieldElement: fieldRef.current,
        formationName,
        players: players.filter((p) => p.isOnField),
        timestamp: new Date().toLocaleDateString(),
      };

      if (format === "image") {
        await exportFormationAsImage(exportData);
      } else if (format === "pdf") {
        await exportFormationAsPDF(exportData);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-container">
      <button
        className="btn primary"
        onClick={() => setShowExportMenu(!showExportMenu)}
        disabled={isExporting}
      >
        {isExporting ? "📤 Exporting..." : "📤 Export"}
      </button>

      {showExportMenu && (
        <div className="export-menu">
          <div className="export-header">
            <strong>Export "{formationName}"</strong>
          </div>
          <button
            className="export-option"
            onClick={() => handleExport("image")}
          >
            🖼️ Save as Image (PNG)
          </button>
          <button className="export-option" onClick={() => handleExport("pdf")}>
            📄 Save as PDF
          </button>
          <button
            className="export-option cancel"
            onClick={() => setShowExportMenu(false)}
          >
            ❌ Cancel
          </button>
        </div>
      )}
    </div>
  );
}
