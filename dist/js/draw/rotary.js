import { ROTOR, housing, apex, rotorCentre, rotorAngle, apexAlpha, faceStroke, faceProgress, flankPoint } from '../sim/rotary.js';
import { C, part, text, rect, circle, stroke, path, pipe, flow, arrow, dot, hatch, fillPart, alpha, hash, lerp, figLabel, para } from './kit.js';
import { note } from './induction.js';
import { STROKE_NAMES } from './fourstroke.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

// The housing's long axis is drawn upright: ports on the left waist, spark plugs on the
// right waist, and the rotor turning anticlockwise on screen.
const CX = 360, CY = 384, K = 250, TAU = Math.PI * 2;
const P = ([x, y]) => [CX - K * y, CY - K * x];
const KINDS = ['air', 'squeezed', 'burning', 'exhaust'];
const PORT_IN = Math.PI / 2 + 0.34, PORT_EX = Math.PI / 2 - 0.34, PLUGS = [1.5 * Math.PI - 0.13, 1.5 * Math.PI + 0.13];
const SPOTS = {
  rotor: { dx: 0, dy: 0, r: 0 }, housing: { dx: -40, dy: -50, r: 0 }, shaft: { dx: 70, dy: 70, r: 34 },
  gears: { dx: -90, dy: 80, r: 0 }, spark: { dx: 50, dy: -70, r: 26 }, intake: { dx: -10, dy: 54, r: 0 },
  exhaust: { dx: -10, dy: -54, r: 0 }, seals: { dx: 50, dy: -40, r: 18 }
};

function curve(f, a0, a1, n = 120) {
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push(P(f(a0 + (a1 - a0) * i / n)));
  return pts;
}

function housingWall(c) {
  const inner = curve(a => housing(a), 0, TAU, 240);
  c.save();
  path(c, inner); c.closePath(); c.strokeStyle = C.ink; c.lineWidth = 70; c.stroke();
  path(c, inner); c.closePath(); c.strokeStyle = hatch(c); c.lineWidth = 66; c.stroke();
  path(c, inner); c.closePath(); c.fillStyle = C.paper; c.fill(); c.strokeStyle = C.ink; c.lineWidth = 1.6; c.stroke();
  c.restore();
}

// Dots of gas in one chamber, placed between the rotor face and the housing wall.
function chamberGas(c, phi, k, time) {
  const s = faceStroke(phi, k), p = faceProgress(phi, k), a0 = apexAlpha(phi, k), n = 18;
  const count = s === 0 ? Math.round(n * p) : s === 3 ? Math.round(n * (1 - p)) : n;
  const jitter = s === 2 ? 2.5 : 0.8;
  for (let i = 0; i < count; i++) {
    const u = 0.12 + 0.76 * hash(i * 3 + k * 50), v = 0.2 + 0.6 * hash(i * 7 + k * 31);
    const [fx, fy] = P(flankPoint(phi, k, u)), [hx, hy] = P(housing(a0 + u * TAU / 3));
    dot(c, lerp(fx, hx, v) + Math.sin(time * 3 + i) * jitter, lerp(fy, hy, v) + Math.cos(time * 2.6 + i) * jitter, 3.6, KINDS[s]);
  }
  if (s === 2 && p < 0.55) { // the burn right after the spark
    const pts = [...curve(a => housing(a), a0, a0 + TAU / 3, 40), ...Array.from({ length: 41 }, (_, i) => P(flankPoint(phi, k, 1 - i / 40)))];
    path(c, pts); c.closePath(); c.fillStyle = alpha(C.burn, 0.4 * (1 - p / 0.55)); c.fill();
  }
  // Name the stroke in the middle of the chamber.
  const [fx, fy] = P(flankPoint(phi, k, 0.5)), [hx, hy] = P(housing(a0 + TAU / 6));
  text(c, L(...STROKE_NAMES[s]), lerp(fx, hx, 0.5), lerp(fy, hy, 0.5) + 6, { size: 15, weight: 800, align: 'center', color: s === 2 ? C.burn : C.ink });
}

function rotorBody(c, phi) {
  const pts = [];
  for (let k = 0; k < 3; k++) for (let i = 0; i < 30; i++) pts.push(P(flankPoint(phi, k, i / 30)));
  path(c, pts); c.closePath(); fillPart(c);
  // A recess in each face, where the charge burns.
  for (let k = 0; k < 3; k++) {
    const [x, y] = P(flankPoint(phi, k, 0.5)), [cx, cy] = P(rotorCentre(phi)), d = Math.hypot(x - cx, y - cy);
    c.beginPath(); c.ellipse(x + (cx - x) / d * 7, y + (cy - y) / d * 7, 26, 5, Math.atan2(y - cy, x - cx) + Math.PI / 2, 0, TAU);
    c.fillStyle = C.paper; c.fill(); c.strokeStyle = C.ink; c.lineWidth = 1; c.stroke();
  }
}

export function drawRotary(c, st) {
  const { theta, time, parts } = st;
  const phi = theta * Math.PI / 180, anchors = {};
  // Ports: intake on the lower left, exhaust on the upper left.
  const portIn = P(housing(PORT_IN)), portEx = P(housing(PORT_EX));
  const inPipe = [[16, portIn[1] + 60], [portIn[0] - 70, portIn[1] + 60], [portIn[0] + 6, portIn[1]]];
  const exPipe = [[portEx[0] + 6, portEx[1]], [portEx[0] - 70, portEx[1] - 60], [16, portEx[1] - 60]];
  const open = kind => [0, 1, 2].some(k => faceStroke(phi, k) === kind);
  part(c, 'housing', () => housingWall(c));
  anchors.housing = P(housing(0.15));
  // The pipes are drawn over the wall, which cuts the port openings into it.
  part(c, 'intake', () => { pipe(c, inPipe, 34); flow(c, inPipe, 'air', time, { rate: open(0) ? 0.9 : 0, spread: 10 }); });
  part(c, 'exhaust', () => { pipe(c, exPipe, 34); flow(c, exPipe, 'exhaust', time, { rate: open(3) ? 0.9 : 0, spread: 10 }); });
  arrow(c, 40, inPipe[0][1], 0, C.ink, 8);
  text(c, L('新鲜空气', 'Fresh air'), 20, inPipe[0][1] + 40, { size: 14, color: C.ink2 });
  text(c, L('废气', 'Exhaust'), 20, exPipe[2][1] - 26, { size: 14, color: C.ink2 });
  anchors.intake = [inPipe[1][0], inPipe[1][1]]; anchors.exhaust = [exPipe[1][0], exPipe[1][1]];
  // Spark plugs at the right-hand waist, firing as a face passes them.
  const firing = [0, 1, 2].some(k => faceStroke(phi, k) === 2 && faceProgress(phi, k) < 0.1);
  part(c, 'spark', () => {
    for (const a of PLUGS) {
      const [x, y] = P(housing(a));
      rect(c, x + 6, y - 9, 40, 18, 3, C.paper2, C.ink, 1.4);
      stroke(c, [[x - 2, y], [x + 8, y]], C.ink, 4);
      if (firing) { circle(c, x - 4, y, 8, alpha(C.burn, 0.5)); circle(c, x - 4, y, 4, C.burn); }
    }
  });
  anchors.spark = P(housing(1.5 * Math.PI));
  for (let k = 0; k < 3; k++) chamberGas(c, phi, k, time);
  part(c, 'rotor', () => rotorBody(c, phi));
  anchors.rotor = P(flankPoint(phi, 0, 0.5));
  part(c, 'seals', () => { for (let k = 0; k < 3; k++) { const [x, y] = P(apex(phi, k)); circle(c, x, y, 5.5, C.accent, C.ink, 1.2); } });
  anchors.seals = P(apex(phi, 0));
  // Phasing gears: a fixed gear on the housing and a ring gear inside the rotor (2 : 3).
  const rc = P(rotorCentre(phi));
  part(c, 'gears', () => {
    c.save(); c.setLineDash([3, 4]);
    circle(c, CX, CY, K * 2 * ROTOR.e, null, C.ink2, 2);
    circle(c, rc[0], rc[1], K * 3 * ROTOR.e, null, C.ink, 2);
    c.restore();
  });
  anchors.gears = [rc[0], rc[1] + K * 3 * ROTOR.e];
  // Eccentric shaft: its marker turns three times for every turn of the rotor's marker.
  part(c, 'shaft', () => {
    circle(c, rc[0], rc[1], K * (ROTOR.e + 0.06), null, C.ink, 1.6);
    circle(c, CX, CY, 16, C.paper, C.ink, 1.6);
    const sm = P([Math.cos(phi) * 0.24, Math.sin(phi) * 0.24]);
    stroke(c, [[CX, CY], sm], C.accent, 3); circle(c, sm[0], sm[1], 5, C.accent);
    const ra = rotorAngle(phi), rm = P([rotorCentre(phi)[0] + Math.cos(ra) * 0.62, rotorCentre(phi)[1] + Math.sin(ra) * 0.62]);
    stroke(c, [rc, rm], C.ink, 2); circle(c, rm[0], rm[1], 6, C.paper, C.ink, 1.6);
  });
  anchors.shaft = [CX, CY];
  const shaftDeg = Math.round(theta), rotorDeg = Math.round(theta / 3);
  note(c, 700, 70, 280, L('转了多少 · 示意', 'HOW FAR IT TURNED'), [
    [L('偏心轴（黄色）', 'Shaft (yellow)'), (shaftDeg % 1080) + '°', true],
    [L('转子（白色）', 'Rotor (white)'), (rotorDeg % 360) + '°'],
    [L('比例', 'Ratio'), '3 : 1']
  ]);
  const rows = [['air', ['新鲜空气', 'Fresh air']], ['squeezed', ['被压缩', 'Squeezed']], ['burning', ['燃烧', 'Burning']], ['exhaust', ['废气', 'Exhaust']]];
  rows.forEach(([kind, name], i) => { dot(c, 716, 300 + i * 28, 5, kind); text(c, L(...name), 732, 305 + i * 28, { size: 14, color: C.ink2 }); });
  para(c, L('每个腔转一圈，就走完四个冲程', 'Each chamber runs all four strokes per rotor turn'), 700, 452, 280, { size: 13, color: C.ink2 });
  if (!st.preview) callouts(c, anchors, SPOTS, parts);
  figLabel(c, st.figure);
}
