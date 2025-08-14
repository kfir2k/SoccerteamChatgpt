import React, { useState } from "react";
import { exportFormationAsImage } from "../utils/exportUtils";

export default function ExportButton({
  fieldRef,
  players,
  formations,
  selectedFormationId,
}) {
  const [isExporting, setIsExporting] = useState(false);

  const selectedFormation = formations.find(
    (f) => f.id === selectedFormationId
  );
  const formationName = selectedFormation?.name || "Current Formation";

  const handleExport = async () => {
    if (!fieldRef?.current) {
      alert("Field not ready for export");
      return;
    }

    setIsExporting(true);

    try {
      const exportData = {
        fieldElement: fieldRef.current,
        formationName,
        players: players.filter((p) => p.isOnField),
        timestamp: new Date().toLocaleDateString(),
      };

      await exportFormationAsImage(exportData);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      className="btn primary"
      onClick={handleExport}
      disabled={isExporting}
      title={`Export "${formationName}" as image`}
    >
      {isExporting ? "📤 Exporting..." : "📤 Export"}
    </button>
  );
}
