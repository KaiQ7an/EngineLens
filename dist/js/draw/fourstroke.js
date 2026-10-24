import { wrap, strokeIndex, strokeProgress, valveLift, sparkGlow, valvesOverlap } from '../sim/kinematics.js';
import { C, text, para, MONO, rect, stroke, pipe, flow, arrow, dot, part, alpha, figLabel, note, isCompact, STROKE_TONES } from './kit.js';
import { drawCylinder, crownY, GAS_KIND } from './engine.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

const CX = 430, CY = 665, S = 1.42;
// On a narrow screen the panel moves out of the figure, so the engine moves to the middle.
const COMPACT_SHIFT = 70;
// Pipes meet the head where its ports open (local x = ±118); the bore matches the port.
const INTAKE = [[118, 30], [118, 250], [CX - 118 * S, 250]];
const EXHAUST = [[CX + 118 * S, 250], [690, 250], [690, 30]];
const shift = (pts, dx) => pts.map(([x, y]) => [x + dx, y]);

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

// What the piston is doing: resting at a dead centre, or which way it is going.
export function pistonState(theta) {
  const a = wrap(theta, 360);
  if (a < 6 || a > 354) return { at: 'tdc', text: L('在上止点（最高）', 'At TDC (top)') };
  if (Math.abs(a - 180) < 6) return { at: 'bdc', text: L('在下止点（最低）', 'At BDC') };
  return a < 180 ? { text: L('↓ 往下走', '↓ down') } : { text: L('↑ 往上走', '↑ up') };
}

// What each moving part is doing at crank angle θ. The panel in the figure shows it;
// on a phone it goes to the page as a text readout instead.
export function readout(theta) {
  const a = wrap(theta), ps = pistonState(a), spark = sparkGlow(a) > 0;
  const valve = (kind, label) => {
    const lift = valveLift(a, kind);
    return { id: kind, label, lift, value: lift > 0.01 ? L('开', 'open') : L('关', 'shut') };
  };
  const overlap = valvesOverlap(a);
  return [
    { id: 'piston', label: L('活塞', 'Piston'), value: ps.text, hot: !!ps.at },
    valve('intake', L('进气门', 'Intake valve')), valve('exhaust', L('排气门', 'Exhaust valve')),
    { id: 'spark', label: L('火花塞', 'Spark plug'), value: spark ? L('点火！', 'Spark!') : '—', hot: spark },
    { id: 'overlap', label: L('气门重叠', 'Valve overlap'), value: overlap ? L('两个气门都开着', 'both valves open') : '—', hot: overlap }
  ];
}

// The panel beside the cylinder. Everything in it is read off the same crank angle as
// the drawing: the four strokes with the current one lit, then each part's state.
function panel(c, a, x0, x1) {
  const cur = strokeIndex(a), prog = strokeProgress(a);
  text(c, L('一个循环 · 曲轴转两圈', 'ONE CYCLE = 2 TURNS'), x0, 112, { size: 12, color: C.ink2, font: MONO, spacing: 0.6 });
  for (let k = 0; k < 4; k++) {
    const y = 150 + k * 44, on = k === cur, tone = C[STROKE_TONES[k]];
    dot(c, x0 + 7, y - 6, 6, GAS_KIND[k]);
    text(c, L(...STROKE_NAMES[k]), x0 + 24, y, { size: on ? 17 : 15, weight: on ? 800 : 500, color: on ? tone : C.ink2 });
    rect(c, x0 + 24, y + 9, x1 - x0 - 24, 4, 2, alpha(C.ink, 0.14));
    if (on) rect(c, x0 + 24, y + 9, Math.max(4, (x1 - x0 - 24) * prog), 4, 2, tone);
  }
  text(c, L('曲轴角', 'Crank angle'), x0, 348, { size: 13.5, color: C.ink2 });
  text(c, Math.round(a) + '°', x1, 350, { size: 24, weight: 500, font: MONO, align: 'right' });
  const [piston, intake, exhaust, spark, overlap] = readout(a);
  const row = (y, { label, value, hot }, hotColor = C.accent) => {
    text(c, label, x0, y, { size: 13.5, color: C.ink2 });
    text(c, value, x1, y, { size: 15, weight: 700, color: hot ? hotColor : value === '—' ? C.ink2 : C.ink, align: 'right' });
  };
  row(388, piston);
  for (const [v, y, tone] of [[intake, 424, C.intake], [exhaust, 458, C.exhaust]]) {
    const w = 54, bx = x1 - w - 34;
    row(y, v);
    rect(c, bx, y - 9, w, 8, 4, alpha(C.ink, 0.14));
    if (v.lift > 0.01) rect(c, bx, y - 9, Math.max(8, w * v.lift), 8, 4, tone);
  }
  row(492, spark, C.burn);
  if (overlap.hot) para(c, L('两个气门都开着：气门重叠', 'Both valves open: valve overlap'), x0, 532, x1 - x0, { size: 13.5, weight: 700, color: C.accent });
}

// The two dead centres, marked on the bore like dimension lines on a drawing.
function deadCentres(c, a, cx) {
  const yT = CY + crownY(0) * S, yB = CY + crownY(180) * S, x = cx - 96 * S - 10, ps = pistonState(a);
  for (const [y, at, zh, en] of [[yT, 'tdc', '上止点', 'TDC'], [yB, 'bdc', '下止点', 'BDC']]) {
    const on = ps.at === at;
    stroke(c, [[x - 34, y], [x, y]], on ? C.accent : C.ink2, on ? 2 : 1, on ? null : [3, 3]);
    text(c, L(zh, en), x - 40, y + 5, { size: 13, weight: on ? 800 : 500, color: on ? C.accent : C.ink2, align: 'right' });
  }
  stroke(c, [[x - 17, yT + 4], [x - 17, yB - 4]], C.ink2, 1);
  arrow(c, x - 17, yT + 2, -Math.PI / 2, C.ink2, 5); arrow(c, x - 17, yB - 2, Math.PI / 2, C.ink2, 5);
  text(c, L('行程', 'Stroke'), x - 24, (yT + yB) / 2 + 5, { size: 12.5, color: C.ink2, align: 'right' });
}

export function drawFourStroke(c, st) {
  const { theta, time, parts, speed = 24 } = st;
  const compact = isCompact(), a = wrap(theta), dx = compact ? COMPACT_SHIFT : 0, intake = shift(INTAKE, dx), exhaust = shift(EXHAUST, dx);
  part(c, 'intake-port', () => {
    pipe(c, intake, 38);
    flow(c, intake, 'air', time, { rate: st.flow.intake, strength: Math.min(1, st.flow.intake * 3), lanes: 2, spread: 12 });
  });
  arrow(c, 118 + dx, 70, Math.PI / 2, C.ink, 8);
  text(c, L('新鲜空气', 'Fresh air'), 150 + dx, 52, { size: 14, color: C.ink2, weight: 500 });
  part(c, 'exhaust-port', () => {
    pipe(c, exhaust, 38);
    flow(c, exhaust, 'exhaust', time, { rate: st.flow.exhaust, strength: Math.min(1, st.flow.exhaust * 3), lanes: 2, spread: 12 });
  });
  arrow(c, 690 + dx, 66, -Math.PI / 2, C.ink, 8);
  text(c, L('废气', 'Exhaust'), 722 + dx, 52, { size: 14, color: C.ink2, weight: 500 });
  const anchors = drawCylinder(c, a, { x: CX + dx, y: CY, s: S, air: 26, time, cams: true });
  deadCentres(c, a, CX + dx);
  if (compact) note(c, 0, 0, 0, L('此刻', 'RIGHT NOW'), readout(a).map(r => [r.label, r.value, r.hot]));
  else panel(c, a, 752, 978);
  if (!st.preview) callouts(c, anchors, SPOTS, parts);
  figLabel(c, st.figure);
  return { anchors, gas: GAS_KIND[strokeIndex(a)], speed };
}
