import { CYCLE, wrap } from './kinematics.js';

// Cylinders are named by bank and position along the crank: 'A1' is the front
// cylinder of an inline engine, 'L3' the third cylinder of a V engine's left bank.
// Cylinders fire at even intervals of 720° / cylinder count, in firing order.
export const ENGINES = {
  inline4: { banks: ['A'], vAngle: 0, firing: ['A1', 'A3', 'A4', 'A2'] },
  // GM LS-family cross-plane order 1-8-7-2-6-5-4-3, with odd cylinders on the left bank.
  v8cross: { banks: ['L', 'R'], vAngle: 90, firing: ['L1', 'R4', 'L4', 'R1', 'R3', 'L3', 'R2', 'L2'] },
  // A typical flat-plane order: the banks alternate, and each bank fires like an inline-four.
  v8flat: { banks: ['L', 'R'], vAngle: 90, firing: ['L1', 'R3', 'L3', 'R4', 'L4', 'R2', 'L2', 'R1'] }
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
