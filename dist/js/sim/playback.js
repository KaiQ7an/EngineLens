import { wrap } from './kinematics.js';

// All particle positions in a cylinder are derived from its crank angle.
export const crankTime = theta => theta / 96;
export const displayAngle = (theta, end = false) => end && Math.abs(wrap(theta)) < 1e-7 ? 720 : Math.round(wrap(theta)) % 720;
export function stepTarget(theta, target, back = false) {
  let to = theta - wrap(theta) + target;
  if (back ? to > theta : to < theta - 0.01) to += back ? -720 : 720;
  return to;
}

// Choose the earliest stop, even if one frame crosses several unsorted marks.
export function advanceCrank(theta, dt, rpm, marks = []) {
  const after = theta + Math.min(600, Math.max(0, rpm)) * 6 * Math.max(0, dt);
  let stop = Infinity;
  for (const at of marks) {
    let mark = at + 720 * Math.ceil((theta - at) / 720);
    if (mark <= theta + 1e-7) mark += 720;
    if (mark <= after) stop = Math.min(stop, mark);
  }
  return { theta: Math.min(stop, after), stopped: Number.isFinite(stop) };
}

// Paused means frozen: do not run view-specific clocks or boost responses.
export function advanceClock(state, dt, update) {
  if (!state.playing) return;
  state.time += dt;
  update?.(state, dt);
}
