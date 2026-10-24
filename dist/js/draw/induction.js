import { steadyBoost, tipIn, airCharge, wastegateOpen } from '../sim/induction.js';
import { wrap } from '../sim/kinematics.js';
import { C, MONO, part, text, rect, circle, stroke, path, pipe, flow, arrow, fillCut, fillPart, clamp, alpha, figLabel, measure } from './kit.js';
import { drawCylinder } from './engine.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

// Boost right now: the steady value for this rpm, scaled while a tip-in builds up.
export function boostNow(mode, st) {
  const steady = steadyBoost(mode, st.rpm);
  if (mode === 'na' || st.tip < 0 || st.tip === undefined) return steady;
  return steady * tipIn(mode, st.tip);
}
const pct = v => Math.round(v * 100) + '%';
const bar = v => (v > 0.005 ? '+' : '') + v.toFixed(2) + ' bar';

// A dashed blueprint annotation block with key / value rows.
export function note(c, x, y, w, title, rows) {
  // A value too long to share its row with the label drops onto a line of its own.
  const fits = rows.map(r => measure(c, r[0], 14) + measure(c, r[1], 17, 500, MONO) + 20 <= w - 32);
  const h = 40 + fits.reduce((s, f) => s + (f ? 30 : 54), 0);
  c.save(); c.setLineDash([5, 5]); rect(c, x, y, w, h, 6, alpha(C.paper, 0.85), C.ink2, 1); c.restore();
  text(c, title, x + 16, y + 26, { size: 12, color: C.ink2, font: MONO, spacing: 1.2 });
  let yy = y + 56;
  rows.forEach((r, i) => {
    text(c, r[0], x + 16, yy, { size: 14, color: C.ink2 });
    if (!fits[i]) yy += 24;
    text(c, r[1], x + w - 16, yy, { size: 17, color: r[2] ? C.accent : C.ink, font: MONO, weight: 500, align: 'right' });
    yy += 30;
  });
  return [x + w / 2, y + h / 2];
}

// Front view of a turbo wheel inside its housing.
function wheel(c, x, y, r, angle, blades = 10) {
  c.beginPath(); c.arc(x, y, r + 20, 0, Math.PI * 2); fillCut(c);
  circle(c, x, y, r + 3, C.paper, C.ink, 1.4);
  c.save(); c.translate(x, y); c.rotate(angle);
  for (let i = 0; i < blades; i++) {
    c.rotate(Math.PI * 2 / blades);
    path(c, [[8, 0], [r * 0.45, -r * 0.18], [r - 4, -r * 0.08]]);
    c.strokeStyle = C.ink; c.lineWidth = 1.6; c.stroke();
  }
  c.restore();
  circle(c, x, y, 10, C.paper, C.ink, 1.4);
  circle(c, x, y, 3, C.ink);
}

function filterBox(c, x, y, w, h) {
  c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 6); fillCut(c);
  rect(c, x - w / 2 + 8, y - h / 2 + 8, w - 16, h - 16, 3, C.paper, C.ink, 1);
  const pts = [];
  for (let k = 0; k <= 10; k++) pts.push([x + (k % 2 ? 8 : -8), y - h / 2 + 10 + (h - 20) * k / 10]);
  stroke(c, pts, C.ink2, 1.2);
}

// ── Naturally aspirated ─────────────────────────────────────────────
const NA = { x: 560, y: 690, s: 1.05 };
const NA_IN = [[24, 383], [NA.x - 118 * NA.s, 383]];
const NA_OUT = [[NA.x + 118 * NA.s, 383], [990, 383]];
const NA_SPOTS = {
  filter: { dx: 0, dy: -96, r: 62 }, throttle: { dx: 0, dy: -84, r: 34 },
  'intake-valve': { dx: -96, dy: 70, r: 30 }, chamber: { dx: 130, dy: 10, r: 44 },
  piston: { dx: -116, dy: 30, r: 46 }, 'exhaust-pipe': { dx: 0, dy: -64, r: 34 }
};

export function drawNA(c, st) {
  const { theta, time, parts } = st;
  const a = wrap(theta), boost = boostNow('na', st);
  const speed = 0.6 + st.rpm / 4000;
  pipe(c, NA_IN, 32);
  part(c, 'filter', () => filterBox(c, 112, 383, 74, 124));
  flow(c, NA_IN, 'air', time, { rate: st.flow.intake * speed, strength: clamp(st.flow.intake * 3), spread: 10 });
  part(c, 'throttle', () => {
    circle(c, 300, 383, 22, null, C.ink, 1.4);
    const open = 1.35; // near full throttle
    stroke(c, [[300 - Math.cos(open) * 20, 383 - Math.sin(open) * 20], [300 + Math.cos(open) * 20, 383 + Math.sin(open) * 20]], C.ink, 3);
    circle(c, 300, 383, 3, C.ink);
  });
  part(c, 'exhaust-pipe', () => {
    pipe(c, NA_OUT, 32);
    flow(c, NA_OUT, 'exhaust', time, { rate: st.flow.exhaust * speed, strength: clamp(st.flow.exhaust * 3), spread: 10 });
  });
  // The atmosphere pressing on the open end of the intake: it does the pushing.
  for (let row = 0; row < 3; row++) for (let col = 0; col < 7; col++) {
    const x = 34 + col * 36 + (row % 2) * 18, y = 470 + row * 34;
    stroke(c, [[x - 6, y - 5], [x, y + 3], [x + 6, y - 5]], C.ink2, 1.3);
  }
  text(c, L('外面的大气：约 1 个大气压，一直在往里"推"', 'The atmosphere: about 1 bar, always pushing in'), 24, 450, { size: 14, color: C.ink2 });
  arrow(c, 40, 383, 0, C.ink, 8);
  text(c, L('废气', 'Exhaust'), 990, 352, { size: 14, color: C.ink2, align: 'right' });
  const anchors = drawCylinder(c, a, { x: NA.x, y: NA.y, s: NA.s, air: Math.round(22 * airCharge(boost)), time, flowRate: speed });
  Object.assign(anchors, { filter: [112, 383], throttle: [300, 383], 'exhaust-pipe': [840, 383] });
  note(c, 700, 60, 280, L('读数 · 示意', 'READOUT · MODEL'), [
    [L('进气压力', 'Intake pressure'), bar(boost)],
    [L('每次吸进的空气', 'Air per breath'), pct(airCharge(boost))],
    [L('增压装置', 'Booster'), L('无', 'None')]
  ]);
  if (!st.preview) callouts(c, anchors, NA_SPOTS, parts);
  figLabel(c, st.figure);
}

// ── Turbocharged ────────────────────────────────────────────────────
const TB = { x: 560, y: 700, s: 1 };
const COMP = [330, 175], TURB = [720, 175], WR = 62;
const T_FRESH = [[20, 175], [COMP[0] - 20, 175]];
const T_CHARGE = [[COMP[0], COMP[1] + 70], [COMP[0], 300], [150, 300], [150, 408], [TB.x - 118, 408]];
const T_EXH = [[TB.x + 118, 408], [830, 408], [830, 175], [TURB[0] + 82, 175]];
const T_OUT = [[TURB[0], TURB[1] - 82], [TURB[0], 24]];
const T_GATE = [[830, 300], [920, 300], [920, 24]];
const TB_SPOTS = {
  turbine: { dx: 0, dy: 118, r: 84 }, compressor: { dx: 0, dy: 118, r: 84 }, shaft: { dx: 0, dy: -70, r: 36 },
  intercooler: { dx: -86, dy: -70, r: 56 }, wastegate: { dx: 30, dy: 64, r: 26 }, bov: { dx: 0, dy: -60, r: 22 },
  chamber: { dx: -150, dy: 40, r: 42 }
};

export function drawTurbo(c, st) {
  const { theta, time, parts } = st;
  const a = wrap(theta), boost = boostNow('turbo', st), spool = clamp(boost / 0.85);
  const gate = wastegateOpen(st.rpm) && spool > 0.98;
  const speed = 0.6 + st.rpm / 4000, density = 1 + boost * 1.3;
  pipe(c, T_FRESH, 32);
  flow(c, T_FRESH, 'air', time, { rate: speed * (0.4 + spool), spread: 10 });
  part(c, 'intercooler', () => {
    pipe(c, T_CHARGE, 32);
    c.beginPath(); c.roundRect(104, 318, 92, 74, 6); fillCut(c);
    for (let k = 0; k < 7; k++) stroke(c, [[112 + k * 12.5, 322], [112 + k * 12.5, 388]], C.ink2, 1);
    rect(c, 134, 318, 32, 74, 2, C.paper, C.ink, 1);
  });
  flow(c, T_CHARGE, 'squeezed', time, { rate: speed * (0.4 + spool), density, spread: 10, r: 3.4 });
  part(c, 'bov', () => {
    rect(c, 238, 268, 24, 18, 3, C.paper, C.ink, 1.4);
    stroke(c, [[250, 268], [250, 252]], C.ink, 2);
  });
  part(c, 'exhaust', () => {
    pipe(c, T_EXH, 32); pipe(c, T_OUT, 32);
    flow(c, T_EXH, 'exhaust', time, { rate: st.flow.exhaust * speed + 0.3, spread: 10 });
    flow(c, T_OUT, 'exhaust', time, { rate: speed * (0.5 + spool) * 0.8, spread: 10 });
  });
  part(c, 'wastegate', () => {
    pipe(c, T_GATE, 22);
    if (gate) flow(c, T_GATE, 'exhaust', time, { rate: speed, lanes: 1, density: 0.7 });
    circle(c, 875, 300, 13, C.paper, C.ink, 1.4);
    const ang = gate ? 0.2 : Math.PI / 2;
    stroke(c, [[875 - Math.cos(ang) * 11, 300 - Math.sin(ang) * 11], [875 + Math.cos(ang) * 11, 300 + Math.sin(ang) * 11]], C.ink, 2.5);
  });
  const spin = time * (2 + spool * 26);
  part(c, 'shaft', () => {
    c.beginPath(); c.roundRect(COMP[0] + WR + 10, 150, TURB[0] - COMP[0] - 2 * WR - 20, 50, 8); fillCut(c);
    rect(c, COMP[0], 170, TURB[0] - COMP[0], 10, 4, C.paper, C.ink, 1.2);
  });
  part(c, 'compressor', () => wheel(c, ...COMP, WR, -spin));
  part(c, 'turbine', () => wheel(c, ...TURB, WR, spin, 11));
  text(c, L('新鲜空气', 'Fresh air'), 24, 140, { size: 14, color: C.ink2 });
  text(c, L('废气排出', 'Exhaust out'), TURB[0] - 18, 40, { size: 14, color: C.ink2, align: 'right' });
  const anchors = drawCylinder(c, a, { x: TB.x, y: TB.y, s: TB.s, air: Math.round(22 * airCharge(boost)), time, flowRate: speed, density, intakeKind: 'squeezed' });
  Object.assign(anchors, { turbine: TURB, compressor: COMP, shaft: [525, 175], intercooler: [150, 355], wastegate: [875, 300], bov: [250, 270] });
  const state = st.tip >= 0 && spool < 0.9 ? L('涡轮还在加速（迟滞）', 'Spooling up (lag)') : gate ? L('增压够了，旁通阀打开', 'Full boost, wastegate open') : spool < 0.05 ? L('转速太低，废气推不动', 'Too few revs to spin it') : L('增压中', 'Boosting');
  note(c, 708, 520, 272, L('读数 · 示意', 'READOUT · MODEL'), [
    [L('增压', 'Boost'), bar(boost), true],
    [L('每次吸进的空气', 'Air per breath'), pct(airCharge(boost))],
    [L('状态', 'State'), state]
  ]);
  if (!st.preview) callouts(c, anchors, TB_SPOTS, parts);
  figLabel(c, st.figure);
}

// ── Supercharged ────────────────────────────────────────────────────
const SC = { x: 600, y: 700, s: 1 };
const BLOWER = [280, 250], ROTOR = 50;
const S_IN = [[BLOWER[0], 24], [BLOWER[0], 178]];
const S_CHARGE = [[BLOWER[0], 322], [BLOWER[0], 408], [SC.x - 118, 408]];
const S_OUT = [[SC.x + 118, 408], [990, 408]];
const PULLEY = [225, 560, 34], CRANK = [SC.x, SC.y, 50];
const SC_SPOTS = {
  blower: { dx: 0, dy: -120, r: 110 }, belt: { dx: -70, dy: 56, r: 30 }, pulley: { dx: 130, dy: -64, r: 58 },
  chamber: { dx: 140, dy: 4, r: 42 }, parasitic: { dx: -150, dy: 0, r: 0 }
};

function lobes(c, x, y, r, angle) {
  c.save(); c.translate(x, y); c.rotate(angle);
  c.beginPath();
  for (let i = 0; i <= 96; i++) {
    const t = i / 96 * Math.PI * 2, rr = r * (0.7 + 0.3 * Math.cos(3 * t));
    i ? c.lineTo(Math.cos(t) * rr, Math.sin(t) * rr) : c.moveTo(Math.cos(t) * rr, Math.sin(t) * rr);
  }
  c.closePath(); fillPart(c);
  circle(c, 0, 0, 5, C.ink);
  c.restore();
}

// Belt run between two pulleys: the two outer tangent lines.
function belt(c, [x1, y1, r1], [x2, y2, r2], time, speed) {
  const ang = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), al = Math.acos((r1 - r2) / d);
  c.save(); c.setLineDash([10, 7]); c.lineDashOffset = -time * 60 * speed;
  for (const sgn of [1, -1]) {
    const t = ang + sgn * al;
    stroke(c, [[x1 + Math.cos(t) * r1, y1 + Math.sin(t) * r1], [x2 + Math.cos(t) * r2, y2 + Math.sin(t) * r2]], C.ink, 3);
  }
  c.beginPath(); c.arc(x1, y1, r1, ang + al, ang - al + Math.PI * 2, false); c.strokeStyle = C.ink; c.lineWidth = 3; c.stroke();
  c.beginPath(); c.arc(x2, y2, r2, ang - al, ang + al, false); c.stroke();
  c.restore();
}
function pulley(c, x, y, r, angle) {
  circle(c, x, y, r, C.paper, C.ink, 1.6); circle(c, x, y, r - 7, null, C.ink2, 1);
  c.save(); c.translate(x, y); c.rotate(angle);
  for (let i = 0; i < 5; i++) { c.rotate(Math.PI * 2 / 5); stroke(c, [[6, 0], [r - 8, 0]], C.ink2, 1.4); }
  c.restore(); circle(c, x, y, 6, C.ink);
}

export function drawSuper(c, st) {
  const { theta, time, parts } = st;
  const a = wrap(theta), boost = boostNow('super', st);
  const speed = 0.6 + st.rpm / 4000, density = 1 + boost * 1.3;
  pipe(c, S_IN, 32);
  flow(c, S_IN, 'air', time, { rate: speed, spread: 10 });
  pipe(c, S_CHARGE, 32);
  flow(c, S_CHARGE, 'squeezed', time, { rate: speed, density, spread: 10, r: 3.4 });
  part(c, 'exhaust-pipe', () => { pipe(c, S_OUT, 32); flow(c, S_OUT, 'exhaust', time, { rate: st.flow.exhaust * speed, strength: clamp(st.flow.exhaust * 3), spread: 10 }); });
  const rot = a * Math.PI / 180;
  part(c, 'blower', () => {
    c.beginPath(); c.roundRect(BLOWER[0] - 132, BLOWER[1] - 72, 264, 144, 64); fillCut(c);
    c.beginPath(); c.roundRect(BLOWER[0] - 116, BLOWER[1] - 58, 232, 116, 56); c.fillStyle = C.paper; c.fill(); c.strokeStyle = C.ink; c.lineWidth = 1.4; c.stroke();
    lobes(c, BLOWER[0] - 55, BLOWER[1], ROTOR, rot * 1.6);
    lobes(c, BLOWER[0] + 55, BLOWER[1], ROTOR, -rot * 1.6 + Math.PI / 3);
    stroke(c, [[PULLEY[0], PULLEY[1]], [BLOWER[0] - 55, BLOWER[1] + 50]], C.ink2, 4);
  });
  const anchors = drawCylinder(c, a, { x: SC.x, y: SC.y, s: SC.s, air: Math.round(22 * airCharge(boost)), time, flowRate: speed, density, intakeKind: 'squeezed' });
  part(c, 'belt', () => belt(c, PULLEY, CRANK, time, speed));
  part(c, 'pulley', () => { pulley(c, ...CRANK, rot); pulley(c, ...PULLEY, rot * CRANK[2] / PULLEY[2]); });
  text(c, L('新鲜空气', 'Fresh air'), BLOWER[0] + 26, 46, { size: 14, color: C.ink2 });
  text(c, L('废气', 'Exhaust'), 990, 377, { size: 14, color: C.ink2, align: 'right' });
  // Share of the engine's gross power the blower takes (same model as sim/induction.js).
  const ratio = airCharge(boost), share = 0.22 * (ratio - 1) / ratio;
  const at = note(c, 700, 60, 280, L('读数 · 示意', 'READOUT · MODEL'), [
    [L('增压', 'Boost'), bar(boost), true],
    [L('每次吸进的空气', 'Air per breath'), pct(airCharge(boost))],
    [L('被增压器吃掉', 'Taken by blower'), '≈ ' + Math.round(share * 100) + '%', true]
  ]);
  Object.assign(anchors, { blower: BLOWER, belt: [420, 630], pulley: CRANK.slice(0, 2), parasitic: [700, at[1] + 40] });
  if (!st.preview) callouts(c, anchors, SC_SPOTS, parts);
  figLabel(c, st.figure);
}

// Lesson controls shared by the three induction views: a tip-in replays boost build-up.
export const inductionView = draw => ({
  draw,
  update(st, dt) { if (st.tip >= 0) { st.tip += dt; if (st.tip > 5) st.tip = -1; } },
  bind(root, st) { root.querySelector('#tip-in')?.addEventListener('click', () => { st.tip = 0; st.playing = true; }); }
});
