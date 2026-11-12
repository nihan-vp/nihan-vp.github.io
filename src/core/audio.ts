/**
 * Optional atmospheric sound. Muted by default; nothing is created until the visitor opts in.
 * A slow, detuned drone with filtered air — generated live, no audio files shipped.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let nodes: (OscillatorNode | AudioBufferSourceNode)[] = [];
let on = false;

function build() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 520;
  lp.connect(master);
  [55, 82.5, 110.4, 164.9].forEach((f, i) => {
    const o = ctx!.createOscillator();
    o.type = i % 2 ? "triangle" : "sine";
    o.frequency.value = f;
    const g = ctx!.createGain();
    g.gain.value = 0.16 / (i + 1);
    const lfo = ctx!.createOscillator();
    lfo.frequency.value = 0.04 + i * 0.03;
    const lg = ctx!.createGain();
    lg.gain.value = 0.05;
    lfo.connect(lg).connect(g.gain);
    o.connect(g).connect(lp);
    o.start();
    lfo.start();
    nodes.push(o, lfo);
  });
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
  const n = ctx.createBufferSource();
  n.buffer = buf;
  n.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 900;
  bp.Q.value = 0.6;
  const ng = ctx.createGain();
  ng.gain.value = 0.012;
  n.connect(bp).connect(ng).connect(master);
  n.start();
  nodes.push(n);
}

export function isSoundOn() {
  return on;
}

export async function setSound(enable: boolean) {
  on = enable;
  if (enable) {
    if (!ctx) build();
    await ctx!.resume();
    master!.gain.cancelScheduledValues(ctx!.currentTime);
    master!.gain.linearRampToValueAtTime(0.5, ctx!.currentTime + 2.5);
  } else if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    window.setTimeout(() => !on && ctx?.suspend(), 900);
  }
}

/** Subtle warm ceramic resonance on clay interaction; only sounds when visitor has opted into audio. */
export function playClayTap(intensity = 0.6) {
  if (!on || !ctx || !master || ctx.state !== "running") return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(140 + intensity * 60, now);
  osc.frequency.exponentialRampToValueAtTime(62, now + 0.22);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.14 * Math.min(1, intensity), now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  osc.connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + 0.3);
}
