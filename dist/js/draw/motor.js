import { phaseCurrents, field, rotorAngle, COIL_AXES } from '../sim/motor.js';
import { C, MONO, part, partAny, text, rect, circle, stroke, poly, fillCut, fillPart, alpha, pointAt, pathLength, figLabel } from './kit.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

// Cross-section of a two-pole permanent-magnet motor, with its three phase currents
// and the battery → inverter → motor chain beside it. Angles are electrical.
const CX = 320, CY = 390, R_OUT = 250, R_IN = 168, R_ROTOR = 146, TAU = Math.PI * 2;
const at = (a, r) => [CX + r * Math.cos(a), CY - r * Math.sin(a)];
const PHASES = ['A', 'B', 'C'];
const STYLE = [{ dash: null, color: () => C.ink }, { dash: [7, 5], color: () => C.ink2 }, { dash: [2, 4], color: () => C.accent }];
const WAVE = { x0: 640, x1: 970, y: 210, amp: 70 };
const CHAIN = [['battery', 660, 560], ['inverter', 790, 560], ['motor', 920, 560]];
const SPOTS = {
  stator: { dx: 50, dy: -96, r: 0 }, rotor: { dx: 90, dy: 120, r: 0 }, field: { dx: 40, dy: -40, r: 28 },
  waves: { dx: -60, dy: -100, r: 0 }, inverter: { dx: 0, dy: -64, r: 0 }, battery: { dx: 0, dy: -64, r: 0 }
};

function arrowLine(c, from, to, color, width = 4) {
  stroke(c, [from, to], color, width);
  const ang = Math.atan2(to[1] - from[1], to[0] - from[0]), s = 16;
  poly(c, [to, [to[0] - Math.cos(ang - 0.4) * s, to[1] - Math.sin(ang - 0.4) * s], [to[0] - Math.cos(ang + 0.4) * s, to[1] - Math.sin(ang + 0.4) * s]], color);
}

// A slot marked with the current through it: a dot coming out of the page, a cross
// going in, sized by how strong the current is.
function slotMark(c, [x, y], i, label, style) {
  circle(c, x, y, 17, C.paper, style.color(), 1.6);
  const r = 3 + Math.abs(i) * 9;
  if (i > 0.05) circle(c, x, y, r * 0.55, style.color());
  else if (i < -0.05) { stroke(c, [[x - r * 0.6, y - r * 0.6], [x + r * 0.6, y + r * 0.6]], style.color(), 2.2); stroke(c, [[x - r * 0.6, y + r * 0.6], [x + r * 0.6, y - r * 0.6]], style.color(), 2.2); }
  text(c, label, x, y - 24, { size: 13, font: MONO, weight: 600, align: 'center', color: style.color() });
}

function stator(c, e) {
  c.beginPath(); c.arc(CX, CY, R_OUT, 0, TAU); c.arc(CX, CY, R_IN, 0, TAU, true); fillCut(c);
  const currents = phaseCurrents(e);
  COIL_AXES.forEach((axis, k) => {
    // Each coil's two sides sit at right angles to the axis it magnetises.
    slotMark(c, at(axis + Math.PI / 2, (R_IN + R_OUT) / 2 - 18), currents[k], PHASES[k] + '+', STYLE[k]);
    slotMark(c, at(axis - Math.PI / 2, (R_IN + R_OUT) / 2 - 18), -currents[k], PHASES[k] + '−', STYLE[k]);
  });
  return at(Math.PI * 0.8, R_OUT - 20);
}

function rotor(c, angle) {
  c.save(); c.translate(CX, CY); c.rotate(-angle);
  c.beginPath(); c.arc(0, 0, R_ROTOR, -Math.PI / 2, Math.PI / 2); c.closePath(); fillPart(c);
  c.beginPath(); c.arc(0, 0, R_ROTOR, Math.PI / 2, Math.PI * 1.5); c.closePath(); c.fillStyle = alpha(C.ink, 0.03); c.fill(); c.strokeStyle = C.ink; c.lineWidth = 1.4; c.stroke();
  text(c, 'N', R_ROTOR * 0.62, 8, { size: 28, weight: 900, align: 'center' });
  text(c, 'S', -R_ROTOR * 0.62, 8, { size: 28, weight: 900, align: 'center', color: C.ink2 });
  c.restore();
  circle(c, CX, CY, 20, C.paper, C.ink, 1.6);
  return at(angle + Math.PI, R_ROTOR * 0.62);
}

function waves(c, e) {
  const { x0, x1, y, amp } = WAVE, sx = a => x0 + (x1 - x0) * a / TAU, ph = ((e % TAU) + TAU) % TAU;
  stroke(c, [[x0, y], [x1, y]], C.faint, 1);
  PHASES.forEach((p, k) => {
    const pts = [];
    for (let a = 0; a <= TAU + 1e-9; a += TAU / 90) pts.push([sx(a), y - amp * Math.cos(a - COIL_AXES[k])]);
    stroke(c, pts, STYLE[k].color(), 2, STYLE[k].dash);
    text(c, p, x1 + 10, y - amp * Math.cos(TAU - COIL_AXES[k]) + 5, { size: 13, font: MONO, weight: 600, color: STYLE[k].color() });
  });
  stroke(c, [[sx(ph), y - amp - 12], [sx(ph), y + amp + 12]], C.accent, 2);
  phaseCurrents(e).forEach((v, k) => circle(c, sx(ph), y - amp * v, 4.5, STYLE[k].color()));
  text(c, L('三相电流（一圈）', 'Three-phase current (one turn)'), x0, y - amp - 24, { size: 13, color: C.ink2 });
  return [(x0 + x1) / 2, y];
}

function chain(c, mode, time) {
  const names = { battery: ['电池', 'Battery'], inverter: ['电控', 'Inverter'], motor: ['电机', 'Motor'] };
  const pts = [[CHAIN[0][1] + 40, CHAIN[0][2]], [CHAIN[2][1] - 40, CHAIN[2][2]]];
  stroke(c, pts, C.ink2, 2);
  const flowPts = mode === 'regen' ? [...pts].reverse() : pts, len = pathLength(flowPts);
  for (let d = (time * 70) % 26; d < len; d += 26) { const [x, y] = pointAt(flowPts, d); circle(c, x, y, 3.5, C.accent); }
  const out = {};
  for (const [id, x, y] of CHAIN) {
    rect(c, x - 40, y - 30, 80, 60, 10, C.paper, C.ink, 1.6);
    text(c, L(...names[id]), x, y + 6, { size: 16, weight: 700, align: 'center' });
    out[id] = [x, y - 30];
  }
  const label = mode === 'regen' ? L('回收：车轮带着电机发电 → 电池', 'Regen: the wheels turn the motor → battery') : L('驱动：电池 → 电控 → 电机', 'Drive: battery → inverter → motor');
  text(c, label, CHAIN[0][1] - 40, CHAIN[0][2] + 66, { size: 14, weight: 600, color: mode === 'regen' ? C.accent : C.ink });
  return out;
}

export function drawMotor(c, st) {
  const { theta, time, parts } = st;
  const mode = st.step?.mode ?? 'drive', e = theta * Math.PI / 180, f = field(e), anchors = {};
  part(c, 'stator', () => { anchors.stator = stator(c, e); });
  part(c, 'rotor', () => { anchors.rotor = rotor(c, rotorAngle(e, mode)); });
  part(c, 'field', () => {
    const tip = at(f.angle, R_IN - 8);
    arrowLine(c, at(f.angle + Math.PI, R_IN - 8), tip, C.accent, 5);
    const [lx, ly] = at(f.angle, R_IN - 44);
    text(c, L('磁场', 'Field'), lx, ly - 10, { size: 14, weight: 800, color: C.accent, align: 'center' });
    anchors.field = tip;
  });
  part(c, 'waves', () => { anchors.waves = waves(c, e); });
  partAny(c, ['battery', 'inverter'], () => Object.assign(anchors, chain(c, mode, time)));
  anchors.battery ??= [CHAIN[0][1], CHAIN[0][2] - 30];
  anchors.inverter ??= [CHAIN[1][1], CHAIN[1][2] - 30];
  text(c, L('看：线圈不动，磁场在转，转子跟着它跑', 'Watch: the coils stay put, the field turns, the rotor follows'), 640, 400, { size: 14, color: C.ink2 });
  if (!st.preview) callouts(c, anchors, SPOTS, parts);
  figLabel(c, st.figure);
}
