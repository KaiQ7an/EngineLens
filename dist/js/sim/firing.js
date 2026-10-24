import { CYCLE, wrap } from './kinematics.js';

// Cylinders are named by bank and position along the crank: 'A1' is the front
// cylinder of an inline engine, 'L3' the third cylinder of a V engine's left bank.
// Cylinders fire at even intervals of 720° / cylinder count, in firing order.
export const ENGINES = {
  inline4: { banks: ['A'], vAngle: 0, firing: ['A1', 'A3', 'A4', 'A2'] },
  inline6: { banks: ['A'], vAngle: 0, firing: ['A1', 'A5', 'A3', 'A6', 'A2', 'A4'] },
  // An even-firing 60° V6 alternates banks every 120°; its crank pins are split, so
  // each pair of cylinders sits on its own offset pin.
  v6: { banks: ['L', 'R'], vAngle: 60, firing: ['R1', 'L1', 'R2', 'L2', 'R3', 'L3'] },
  // F1's rules fix the V6 at 90°; it is drawn here firing evenly, like the 60° V6.
  v6f1: { banks: ['L', 'R'], vAngle: 90, firing: ['R1', 'L1', 'R2', 'L2', 'R3', 'L3'] },
  // GM LS-family cross-plane order 1-8-7-2-6-5-4-3, with odd cylinders on the left bank.
  v8cross: { banks: ['L', 'R'], vAngle: 90, firing: ['L1', 'R4', 'L4', 'R1', 'R3', 'L3', 'R2', 'L2'] },
  // A typical flat-plane order: the banks alternate, and each bank fires like an inline-four.
  v8flat: { banks: ['L', 'R'], vAngle: 90, firing: ['L1', 'R3', 'L3', 'R4', 'L4', 'R2', 'L2', 'R1'] },
  // Two inline-sixes (1-5-3-6-2-4 each) on six shared pins, firing alternately every 60°.
  v12: { banks: ['L', 'R'], vAngle: 60, firing: ['L1', 'R2', 'L5', 'R4', 'L3', 'R1', 'L6', 'R5', 'L2', 'R3', 'L4', 'R6'] },
  // W16: two narrow-angle VR8 blocks set 90° apart, so four rows of four cylinders.
  // `angles` gives each row's axis from vertical. The order here is an even-firing
  // example that rotates through the rows, each row firing like an inline-four.
  w16: {
    banks: ['A', 'B', 'C', 'D'], angles: [-52.5, -37.5, 37.5, 52.5],
    firing: ['A1', 'C1', 'B1', 'D1', 'A3', 'C3', 'B3', 'D3', 'A4', 'C4', 'B4', 'D4', 'A2', 'C2', 'B2', 'D2']
  },
  // Boxers: opposite cylinders share a position and reach TDC together, so their
  // pistons move out and in at the same time. Subaru's flat-four fires 1-3-2-4 and
  // Porsche's flat-six 1-6-2-4-3-5 (cylinders 1-3 on one bank, 4-6 on the other).
  flat4: { banks: ['L', 'R'], vAngle: 180, boxer: true, firing: ['L1', 'L2', 'R1', 'R2'] },
  flat6: { banks: ['L', 'R'], vAngle: 180, boxer: true, firing: ['L1', 'R3', 'L2', 'R1', 'L3', 'R2'] }
};

export const interval = engine => CYCLE / engine.firing.length;

// Global crank angle at which each cylinder fires (its compression TDC).
export function fireAngles(engine) {
  const step = interval(engine);
  return Object.fromEntries(engine.firing.map((cyl, i) => [cyl, i * step]));
}

// A cylinder's own position in its four-stroke cycle. Local 360° is its firing TDC,
// matching the single-cylinder convention in kinematics.js.
export function localAngle(theta, engine, cyl) {
  return wrap(theta - fireAngles(engine)[cyl] + 360);
}

export const cylinders = (engine, bank) => engine.firing.filter(c => !bank || c[0] === bank)
  .sort((a, b) => a.slice(1) - b.slice(1));

// Gaps between consecutive firings within one bank, in firing sequence.
export function bankIntervals(engine, bank) {
  const angles = Object.entries(fireAngles(engine)).filter(([c]) => c[0] === bank).map(([, a]) => a).sort((a, b) => a - b);
  return angles.map((a, i) => wrap((angles[i + 1] ?? angles[0] + CYCLE) - a));
}

// Direction a crank throw points (0–360°) when θ = 0, measured from the left bank's
// cylinder axis. Both cylinders sharing a throw must agree, which tests rely on.
export function throwAngle(engine, cyl) {
  const fired = fireAngles(engine)[cyl];
  return wrap(-(fired + (cyl[0] === 'R' ? engine.vAngle : 0)), 360);
}

// The cylinder that fired most recently at crank angle θ, and how long ago.
export function lastFired(theta, engine) {
  const step = interval(engine);
  const i = Math.floor(wrap(theta) / step);
  return { cyl: engine.firing[i], since: wrap(theta) - i * step };
}

// Inertia forces of an inline engine along the cylinder axis, per unit of r·mω².
// The primary force varies once per revolution; the secondary, twice.
export function inlineForces(theta, engine, ratio) {
  let primary = 0, secondary = 0;
  for (const cyl of engine.firing) {
    const a = localAngle(theta, engine, cyl) * Math.PI / 180;
    primary += Math.cos(a);
    secondary += ratio * Math.cos(2 * a);
  }
  return { primary, secondary };
}

// ── How evenly the cylinders share the work ─────────────────────────
// A teaching model of one cylinder's push on the crank through its power stroke:
// zero outside it, peaking about 60° after TDC. Compression is left out.
export function powerPulse(local) {
  const x = (wrap(local) - 360) / 180;
  if (x <= 0 || x >= 1) return 0;
  return Math.sin(Math.PI * x ** 0.65);
}

export const push = (theta, engine) => engine.firing.reduce((sum, cyl) => sum + powerPulse(localAngle(theta, engine, cyl)), 0);

// How many cylinders are in their power stroke at crank angle θ.
export const pushing = (theta, engine) => engine.firing.filter(cyl => { const a = localAngle(theta, engine, cyl); return a >= 360 && a < 540; }).length;

// Weakest push over the cycle as a share of the strongest: 0 means the push drops out.
export function smoothness(engine, step = 1) {
  let lo = Infinity, hi = 0;
  for (let t = 0; t < CYCLE; t += step) { const p = push(t, engine); lo = Math.min(lo, p); hi = Math.max(hi, p); }
  return lo / hi;
}
