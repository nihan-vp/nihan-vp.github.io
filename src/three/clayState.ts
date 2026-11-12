export type ClayForm = "organic" | "torsion" | "facet" | "harmonic";
export type ClayFinish = "raw" | "glaze" | "topo" | "wire";
export type ClayTool = "orbit" | "push" | "pull" | "ripple";

export interface ClayStamp {
  x: number;
  y: number;
  z: number;
  strength: number;
}

export const MAX_STAMPS = 16;

export interface ClaySnapshot {
  form: ClayForm;
  finish: ClayFinish;
  tool: ClayTool;
  stampCount: number;
  stageVisible: boolean;
  hovering: boolean;
}

type Listener = (snap: ClaySnapshot) => void;

class ClayController {
  form: ClayForm = "organic";
  finish: ClayFinish = "raw";
  tool: ClayTool = "orbit";
  stamps: ClayStamp[] = [];
  stageVisible = true;
  hovering = false;

  private listeners = new Set<Listener>();
  private resetListeners = new Set<() => void>();
  private pulseListeners = new Set<() => void>();

  getSnapshot(): ClaySnapshot {
    return {
      form: this.form,
      finish: this.finish,
      tool: this.tool,
      stampCount: this.stamps.length,
      stageVisible: this.stageVisible,
      hovering: this.hovering,
    };
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  onReset(fn: () => void) {
    this.resetListeners.add(fn);
    return () => {
      this.resetListeners.delete(fn);
    };
  }

  onPulse(fn: () => void) {
    this.pulseListeners.add(fn);
    return () => {
      this.pulseListeners.delete(fn);
    };
  }

  private emit() {
    const snap = this.getSnapshot();
    this.listeners.forEach((fn) => fn(snap));
  }

  setForm(form: ClayForm) {
    if (this.form === form) return;
    this.form = form;
    this.emit();
  }

  setFinish(finish: ClayFinish) {
    if (this.finish === finish) return;
    this.finish = finish;
    this.emit();
  }

  setTool(tool: ClayTool) {
    if (this.tool === tool) return;
    this.tool = tool;
    this.emit();
  }

  setStageVisible(v: boolean) {
    if (this.stageVisible === v) return;
    this.stageVisible = v;
    this.emit();
  }

  setHovering(v: boolean) {
    if (this.hovering === v) return;
    this.hovering = v;
    this.emit();
  }

  addStamp(x: number, y: number, z: number, strength: number) {
    // Merge into a nearby existing stamp if very close so repeated strokes build clay smoothly
    for (let i = this.stamps.length - 1; i >= 0; i--) {
      const s = this.stamps[i];
      const dot = s.x * x + s.y * y + s.z * z;
      if (dot > 0.985) {
        s.strength = Math.max(-0.55, Math.min(0.55, s.strength + strength * 0.65));
        s.x = (s.x + x) * 0.5;
        s.y = (s.y + y) * 0.5;
        s.z = (s.z + z) * 0.5;
        const len = Math.hypot(s.x, s.y, s.z) || 1;
        s.x /= len;
        s.y /= len;
        s.z /= len;
        this.emit();
        return;
      }
    }
    if (this.stamps.length >= MAX_STAMPS) this.stamps.shift();
    this.stamps.push({ x, y, z, strength: Math.max(-0.55, Math.min(0.55, strength)) });
    this.emit();
  }

  triggerPulse() {
    this.pulseListeners.forEach((fn) => fn());
  }

  reset() {
    this.stamps = [];
    this.resetListeners.forEach((fn) => fn());
    this.emit();
  }
}

export const clayState = new ClayController();

