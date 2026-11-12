import { useEffect, useRef, useState } from "react";
import { createStage } from "../three/stage";
import { clayState, type ClayFinish, type ClayForm, type ClaySnapshot, type ClayTool } from "../three/clayState";

const FORMS: { id: ClayForm; label: string }[] = [
  { id: "organic", label: "Organic" },
  { id: "torsion", label: "Torsion" },
  { id: "facet", label: "Facet" },
  { id: "harmonic", label: "Harmonic" },
];

const FINISHES: { id: ClayFinish; label: string }[] = [
  { id: "raw", label: "Raw Clay" },
  { id: "glaze", label: "Glazed" },
  { id: "topo", label: "Topo" },
  { id: "wire", label: "Wire" },
];

const TOOLS: { id: ClayTool; label: string; hint: string }[] = [
  { id: "orbit", label: "Orbit", hint: "Drag sculpture to orbit · Click to ripple" },
  { id: "push", label: "Push", hint: "Click & drag on sculpture to indent clay" },
  { id: "pull", label: "Pull", hint: "Click & drag on sculpture to raise clay" },
  { id: "ripple", label: "Ripple", hint: "Click sculpture to send kinetic waves" },
];

/** Mounts the single persistent WebGL canvas + interactive Clay Studio HUD; falls back to CSS without WebGL. */
export default function Stage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);
  const [open, setOpen] = useState(false);
  const [snap, setSnap] = useState<ClaySnapshot>(() => clayState.getSnapshot());

  useEffect(() => {
    const dispose = createStage(ref.current!);
    if (!dispose) setFallback(true);
    const unsub = clayState.subscribe(setSnap);
    return () => {
      unsub();
      dispose?.();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const activeTool = TOOLS.find((t) => t.id === snap.tool) ?? TOOLS[0];
  const formLabel = FORMS.find((f) => f.id === snap.form)?.label ?? "Organic";
  const finishLabel = FINISHES.find((f) => f.id === snap.finish)?.label ?? "Raw Clay";

  return (
    <>
      {fallback && <div className="stage-fallback" aria-hidden="true" />}
      <canvas ref={ref} className="stage" aria-hidden="true" />

      {!fallback && (
        <div className={`clay-hud ${!snap.stageVisible ? "is-hidden" : ""}`}>
          <div
            id="clay-studio"
            className={`clay-panel ${open ? "open" : ""}`}
            role="region"
            aria-label="3D Clay Studio controls"
            aria-hidden={!open}
          >
            <div className="clay-head">
              <div>
                <h2 className="clay-title">Clay Studio</h2>
                <p className="clay-sub mono">{activeTool.hint}</p>
              </div>
              <div className="clay-head-actions">
                <button
                  type="button"
                  className="clay-act mono"
                  onClick={() => clayState.triggerPulse()}
                  tabIndex={open ? 0 : -1}
                  title="Send kinetic wave"
                >
                  Pulse
                </button>
                <button
                  type="button"
                  className="clay-act mono"
                  onClick={() => clayState.reset()}
                  tabIndex={open ? 0 : -1}
                  title="Reset sculpts and rotation"
                >
                  Reset{snap.stampCount > 0 ? ` (${snap.stampCount})` : ""}
                </button>
                <button
                  type="button"
                  className="clay-act mono"
                  onClick={() => setOpen(false)}
                  aria-label="Close Clay Studio"
                  tabIndex={open ? 0 : -1}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="clay-rows">
              <div className="clay-row">
                <span className="clay-lbl mono">Form</span>
                <div className="clay-opts" role="group" aria-label="Sculpture form">
                  {FORMS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`clay-opt mono ${snap.form === f.id ? "on" : ""}`}
                      onClick={() => clayState.setForm(f.id)}
                      aria-pressed={snap.form === f.id}
                      tabIndex={open ? 0 : -1}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="clay-row">
                <span className="clay-lbl mono">Finish</span>
                <div className="clay-opts" role="group" aria-label="Clay surface finish">
                  {FINISHES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`clay-opt mono ${snap.finish === f.id ? "on" : ""}`}
                      onClick={() => clayState.setFinish(f.id)}
                      aria-pressed={snap.finish === f.id}
                      tabIndex={open ? 0 : -1}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="clay-row">
                <span className="clay-lbl mono">Tool</span>
                <div className="clay-opts" role="group" aria-label="Interaction tool">
                  {TOOLS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`clay-opt mono ${snap.tool === t.id ? "on" : ""}`}
                      onClick={() => clayState.setTool(t.id)}
                      aria-pressed={snap.tool === t.id}
                      tabIndex={open ? 0 : -1}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`clay-launch ${open ? "hide" : ""} ${snap.hovering ? "is-live" : ""}`}
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="clay-studio"
            aria-label="Open 3D Clay Studio"
            data-cursor="Studio"
          >
            <span className="clay-orb" aria-hidden="true"><i /></span>
            <span className="clay-launch-t">
              <b>Clay Studio</b>
              <small className="mono">
                {formLabel} · {finishLabel}
              </small>
            </span>
          </button>
        </div>
      )}
    </>
  );
}
