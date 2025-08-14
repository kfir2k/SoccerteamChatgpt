import React, { useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import useLocalStorage from "./hooks/useLocalStorage.js";
import useTournamentMode from "./hooks/useTournamentMode.js";
import usePlayerTimers from "./hooks/usePlayerTimers.js";
import Field from "./components/Field.jsx";
import Bench from "./components/Bench.jsx";
import FormationManager from "./components/FormationManager.jsx";
import PlayerForm from "./components/PlayerForm.jsx";
import SaveFormationModal from "./components/SaveFormationModal.jsx";
import TournamentButton from "./components/TournamentButton.jsx";
import TimesToggle from "./components/TimesToggle.jsx";
import { PlayerDot } from "./components/PlayerCard.jsx";
import { getPositionColor } from "./utils/playerUtils.js";
import {
  DndContext,
  PointerSensor,
  useSensors,
  useSensor,
  DragOverlay,
  rectIntersection,
} from "@dnd-kit/core";

const DOT = 72;

export default function App() {
  const [players, setPlayers] = useLocalStorage("stm_players", []);
  const [formations, setFormations] = useLocalStorage("stm_formations", []);
  const [selectedFormationId, setSelectedFormationId] = useLocalStorage(
    "stm_selectedFormation",
    null
  );
  const [showTimes, setShowTimes] = useLocalStorage("stm_showTimes", true);

  const tournament = useTournamentMode();
  usePlayerTimers(players, setPlayers, tournament);

  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const fieldRef = useRef(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  const [activeId, setActiveId] = useState(null);

  const onAddPlayer = () => {
    setEditTarget(null);
    setShowPlayerForm(true);
  };
  const onEditPlayer = (p) => {
    setEditTarget(p);
    setShowPlayerForm(true);
  };

  const savePlayer = ({ name, position, shirtNumber }) => {
    if (!name) return;
    if (editTarget) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === editTarget.id ? { ...p, name, position, shirtNumber } : p
        )
      );
      toast.success("Player updated");
    } else {
      setPlayers((prev) => [
        ...prev,
        {
          id: uuidv4(),
          name,
          position,
          shirtNumber,
          isOnField: false,
          fieldPosition: { x: 20, y: 20 },
          playingTime: 0,
        },
      ]);
      toast.success("Player added to bench");
    }
    setShowPlayerForm(false);
    setEditTarget(null);
  };

  const deletePlayer = (id) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const getPlayerById = (id) => players.find((p) => p.id === id);
  const activePlayer = activeId ? getPlayerById(activeId) : null;

  const clamp = (x, min, max) => Math.max(min, Math.min(x, max));
  const clampToField = (x, y) => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    return {
      x: clamp(x, 0, rect.width - DOT),
      y: clamp(y, 0, rect.height - DOT),
    };
  };

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragEnd = (event) => {
    const { active, over, delta } = event;
    const data = active.data.current || {};
    const id = data.playerId || active.id;
    if (!over) {
      setActiveId(null);
      return;
    }

    if (data.from === "bench" && over.id === "field") {
      // Place where dropped (center of dragged rect inside field)
      const fieldRect = fieldRef.current.getBoundingClientRect();
      const r = active.rect.current.translated || active.rect.current.initial;
      const centerX = r.left + r.width / 2;
      const centerY = r.top + r.height / 2;
      const pos = clampToField(
        centerX - fieldRect.left - DOT / 2,
        centerY - fieldRect.top - DOT / 2
      );
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isOnField: true, fieldPosition: pos } : p
        )
      );
      toast.success("On field");
    }

    if (data.from === "field") {
      if (over.id === "bench") {
        setPlayers((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isOnField: false } : p))
        );
        toast("Benched");
      } else if (over.id === "field") {
        const startX = data.startX ?? 0;
        const startY = data.startY ?? 0;
        const pos = clampToField(startX + delta.x, startY + delta.y);
        setPlayers((prev) =>
          prev.map((p) => (p.id === id ? { ...p, fieldPosition: pos } : p))
        );
      }
    }

    setActiveId(null);
  };

  const onDeleteFormation = () => {
    if (!selectedFormationId) return;
    setFormations((prev) => prev.filter((f) => f.id !== selectedFormationId));
    setSelectedFormationId(null);
    toast.success("Formation deleted");
  };

  const onSelectFormation = (id) => {
    setSelectedFormationId(id || null);
    if (!id) return;
    const f = formations.find((ff) => ff.id === id);
    if (f) {
      setPlayers(f.players.map((p) => ({ ...p, playingTime: 0 })));
      toast.success(`Loaded formation: ${f.name}`);
    }
  };

  const onSaveFormation = (name) => {
    const snapshot = {
      id: uuidv4(),
      name,
      players: players.map((p) => ({ ...p })),
      createdAt: Date.now(),
    };
    setFormations((prev) => [...prev, snapshot]);
    setShowSaveModal(false);
    setSelectedFormationId(snapshot.id);
    toast.success("Formation saved");
  };

  const benchCount = useMemo(
    () => players.filter((p) => !p.isOnField).length,
    [players]
  );
  const fieldCount = useMemo(
    () => players.filter((p) => p.isOnField).length,
    [players]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="app-shell">
        <div className="header">
          <div className="header-inner">
            <TournamentButton
              isActive={tournament.isActive}
              onStop={tournament.stop}
              openSetup={() => setShowSetup(true)}
            />
            <TimesToggle show={showTimes} setShow={setShowTimes} />
            <FormationManager
              formations={formations}
              selectedId={selectedFormationId}
              onSelect={onSelectFormation}
              onSaveClick={() => setShowSaveModal(true)}
              onDelete={onDeleteFormation}
            />
            <div className="grow" />
            <div className="flex" style={{ fontSize: 12, opacity: 0.8 }}>
              <div>
                On Field: <strong>{fieldCount}</strong>
              </div>
              <div>
                Bench: <strong>{benchCount}</strong>
              </div>
            </div>
          </div>
        </div>

        <main className="main">
          <Field
            players={players}
            fieldRef={fieldRef}
            showTimes={showTimes}
            tournament={tournament}
          />
          <Bench
            players={players}
            onEdit={onEditPlayer}
            onDelete={deletePlayer}
            onAddClick={onAddPlayer}
          />
        </main>

        {showPlayerForm && (
          <PlayerForm
            initial={editTarget}
            onCancel={() => {
              setShowPlayerForm(false);
              setEditTarget(null);
            }}
            onSave={savePlayer}
          />
        )}
        {showSaveModal && (
          <SaveFormationModal
            onCancel={() => setShowSaveModal(false)}
            onSave={onSaveFormation}
          />
        )}
        {showSetup && (
          <SetupModal
            onClose={() => setShowSetup(false)}
            onStart={(min) => {
              setShowSetup(false);
              tournament.start(min);
              toast.success("Game started");
            }}
          />
        )}

        <Toaster position="bottom-center" />
      </div>

      <DragOverlay dropAnimation={null}>
        {activePlayer ? (
          <div style={{ width: 64, height: 64 }}>
            <PlayerDot player={activePlayer} showTimes={false} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function SetupModal({ onClose, onStart }) {
  const [min, setMin] = useState(90);
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Game Timer Setup</h3>
        <div className="row">
          <label>Minutes</label>
          <input
            className="input"
            type="number"
            min="1"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value || "0", 10))}
          />
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={() => onStart(min)}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
