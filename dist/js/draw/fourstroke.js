import { wrap, strokeIndex, VALVES, SPARK, valvesOverlap } from '../sim/kinematics.js';
import { C, text, MONO, circle, stroke, pipe, flow, arrow, dot, part } from './kit.js';
import { drawCylinder, GAS_KIND } from './engine.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

const CX = 430, CY = 665, S = 1.42;
// Pipes meet the head where its ports open (local x = ±118); the bore matches the port.
const INTAKE = [[118, 30], [118, 250], [CX - 118 * S, 250]];
const EXHAUST = [[CX + 118 * S, 250], [690, 250], [690, 30]];

const SPOTS = {
  cams: { dx: -86, dy: -4, r: 30 },
  spark: { dx: 88, dy: -52, r: 24 },
  'intake-valve': { dx: -120, dy: 34, r: 34 },
  'exhaust-valve': { dx: 128, dy: 34, r: 34 },
  chamber: { dx: 128, dy: -6, r: 50 },
  piston: { dx: -116, dy: 18, r: 52 },
  rod: { dx: 130, dy: 10, r: 32 },
  crank: { dx: -108, dy: 30, r: 62 }
};

export const STROKE_NAMES = [['进气', 'Intake'], ['压缩', 'Compression'], ['做功', 'Power'], ['排气', 'Exhaust']];

// The cycle as a dial: one full turn of the dial is 720° of crank rotation.
export function cycleDial(c, theta, x, y, r) {
  const a = wrap(theta), cur = strokeIndex(a);
  const ang = d => -Math.PI / 2 + d / 720 * Math.PI * 2;
  circle(c, x, y, r, null, C.faint, 1);
  for (let k = 0; k < 4; k++) {
    c.beginPath(); c.arc(x, y, r, ang(k * 180) + 0.04, ang(k * 180 + 180) - 0.04);
    c.strokeStyle = k === cur ? (k === 2 ? C.burn : C.ink) : C.faint; c.lineWidth = k === cur ? 5 : 2; c.lineCap = 'butt'; c.stroke();
    const mid = ang(k * 180 + 90), lx = x + Math.cos(mid) * (r + 14), ly = y + Math.sin(mid) * (r + 14);
    text(c, L(...STROKE_NAMES[k]), lx, ly + (Math.sin(mid) > 0 ? 16 : -4),
      { size: 15, weight: k === cur ? 700 : 500, color: k === cur ? C.ink : C.ink2, align: Math.cos(mid) > 0 ? 'left' : 'right' });
  }
  for (const [kind, dash] of [['intake', null], ['exhaust', [4, 4]]]) {
    const { centre, duration } = VALVES[kind];
    c.beginPath(); c.arc(x, y, r - 16, ang(centre - duration / 2), ang(centre + duration / 2));
    c.strokeStyle = C.ink2; c.lineWidth = 1.5; c.lineCap = 'round'; if (dash) c.setLineDash(dash); c.stroke(); c.setLineDash([]);
  }
  const sp = ang(SPARK);
  circle(c, x + Math.cos(sp) * (r - 16), y + Math.sin(sp) * (r - 16), 4, C.burn);
  for (const d of [0, 180, 360, 540]) { const q = ang(d); stroke(c, [[x + Math.cos(q) * (r - 6), y + Math.sin(q) * (r - 6)], [x + Math.cos(q) * (r + 6), y + Math.sin(q) * (r + 6)]], C.ink2, 1); }
  const p = ang(a);
  stroke(c, [[x, y], [x + Math.cos(p) * (r - 4), y + Math.sin(p) * (r - 4)]], C.accent, 2);
  circle(c, x + Math.cos(p) * r, y + Math.sin(p) * r, 6, C.accent);
  circle(c, x, y, 3, C.accent);
  text(c, Math.round(a) + '°', x, y + r + 66, { size: 22, weight: 500, color: C.ink, align: 'center', font: MONO });
  text(c, L('曲轴角', 'Crank angle'), x, y + r + 88, { size: 13, color: C.ink2, align: 'center' });
}

// Key to the dots, drawn on the figure itself.
export function gasKey(c, x, y) {
  const rows = [['air', ['新鲜空气', 'Fresh air']], ['squeezed', ['被压缩的混合气', 'Squeezed charge']], ['burning', ['正在燃烧', 'Burning']], ['exhaust', ['废气', 'Exhaust']]];
  rows.forEach(([kind, name], i) => {
    dot(c, x + 6, y + i * 28, 5, kind);
    text(c, L(...name), x + 22, y + i * 28 + 5, { size: 14, color: C.ink2 });
  });
}

export function drawFourStroke(c, st) {
  const { theta, time, parts, speed = 24, blur = 0 } = st;
  const a = wrap(theta);
  part(c, 'intake-port', () => {
    pipe(c, INTAKE, 38);
    flow(c, INTAKE, 'air', time, { rate: st.flow.intake, strength: Math.min(1, st.flow.intake * 3), lanes: 2, spread: 12 });
  });
  arrow(c, 118, 70, Math.PI / 2, C.ink, 8);
  text(c, L('新鲜空气', 'Fresh air'), 150, 52, { size: 14, color: C.ink2, weight: 500 });
  part(c, 'exhaust-port', () => {
    pipe(c, EXHAUST, 38);
    flow(c, EXHAUST, 'exhaust', time, { rate: st.flow.exhaust, strength: Math.min(1, st.flow.exhaust * 3), lanes: 2, spread: 12 });
  });
  arrow(c, 690, 66, -Math.PI / 2, C.ink, 8);
  text(c, L('废气', 'Exhaust'), 722, 52, { size: 14, color: C.ink2, weight: 500 });
  const anchors = drawCylinder(c, a, { x: CX, y: CY, s: S, air: 26, time, cams: true, blur });
  cycleDial(c, a, 836, 236, 66);
  if (valvesOverlap(a)) text(c, L('两个气门同时开着：气门重叠', 'Both valves open: valve overlap'), 836, 400, { size: 13, color: C.accent, align: 'center', weight: 600 });
  gasKey(c, 790, 470);
  if (!st.preview) callouts(c, anchors, SPOTS, parts);
  text(c, 'FIG. 1', 28, 740, { size: 12, color: C.ink2, font: MONO, spacing: 1 });
  return { anchors, gas: GAS_KIND[strokeIndex(a)], speed };
}
