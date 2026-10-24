import { manifold, gauge, parasitic, power, ALTITUDES, P_SEA } from '../sim/induction.js';
import { C, MONO, part, text, circle, stroke, path, dot, hash, clamp, lerp, figLabel } from './kit.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

// The floor-it test: three 2.0-litre engines at the same speed; at t = 0 the
// throttle snaps open. Each jar holds the air one cylinder takes in per breath.
const MODES = [
  { id: 'na', jar: 'na-jar', x: 180, name: ['自然吸气', 'Naturally aspirated'], line: [] },
  { id: 'turbo', jar: 'turbo-jar', x: 500, name: ['涡轮增压', 'Turbocharged'], line: [] },
  { id: 'super', jar: 'sc-jar', x: 820, name: ['机械增压', 'Supercharged'], line: [10, 7] }
];
const T_MAX = 4;
const CHART = { x0: 96, x1: 940, y0: 712, y1: 500, max: 2 };
// The jars carry their own titles, so their callouts are numbered markers only.
const SPOTS = {
  'na-jar': { dx: -86, dy: -100, r: 0, quiet: true }, 'turbo-jar': { dx: -86, dy: -100, r: 0, quiet: true }, 'sc-jar': { dx: -86, dy: -100, r: 0, quiet: true },
  chart: { dx: 0, dy: -40, r: 0 }, alt: { dx: -40, dy: 24, r: 0 }
};

const cx = t => lerp(CHART.x0, CHART.x1, t / T_MAX);
const cy = v => lerp(CHART.y0, CHART.y1, v / CHART.max);
const lineStyle = id => (id === 'turbo' ? C.accent : id === 'na' ? C.ink2 : C.ink);

function jar(c, m, t, ambient, time) {
  const p = t < 0 ? ambient * 0.35 : manifold(m.id, t, ambient);
  const air = p / (P_SEA * 0.97);
  const x = m.x, top = 96, h = 210, w = 132;
  text(c, L(...m.name), x, 52, { size: 20, weight: 700, align: 'center' });
  path(c, [[x - w / 2, top], [x - w / 2, top + h], [x + w / 2, top + h], [x + w / 2, top]]);
  c.strokeStyle = C.ink; c.lineWidth = 2; c.stroke();
  stroke(c, [[x - w / 2 - 8, top], [x - w / 2 + 10, top]], C.ink, 2); stroke(c, [[x + w / 2 + 8, top], [x + w / 2 - 10, top]], C.ink, 2);
  // Rings of air: their number is the charge, relative to an NA engine at sea level.
  const n = Math.round(22 * air);
  for (let i = 0; i < n; i++) {
    const u = hash(i * 3 + m.x), v = hash(i * 5 + 11);
    dot(c, x - w / 2 + 12 + u * (w - 24) + Math.sin(time * 2 + i) * 1.2, top + 12 + v * (h - 24) + Math.cos(time * 2.3 + i) * 1.2, 4, air > 1.02 ? 'squeezed' : 'air');
  }
  const g = t < 0 ? -ambient * 0.65 : gauge(m.id, t, ambient);
  text(c, (g > 0.005 ? '+' : '') + g.toFixed(2) + ' bar', x, top + h + 34, { size: 19, font: MONO, weight: 500, align: 'center', color: g > 0.005 ? C.accent : C.ink });
  text(c, L('每次吸进 ', 'Air per breath ') + Math.round(air * 100) + '%', x, top + h + 58, { size: 14, color: C.ink2, align: 'center' });
  if (m.id === 'super' && t >= 0) {
    const share = parasitic('super', t, ambient) / (air || 1);
    text(c, L('被增压器吃掉 ≈ ', 'Taken by blower ≈ ') + Math.round(share * 100) + '%', x, top + h + 80, { size: 14, color: C.accent, align: 'center' });
  }
  if (m.id === 'turbo') {
    const spool = t < 0 ? 0 : clamp(gauge('turbo', t, ambient) / 0.8);
    c.save(); c.translate(x + w / 2 + 34, top + 22); c.rotate(time * (1 + spool * 22));
    for (let k = 0; k < 6; k++) { c.rotate(Math.PI / 3); stroke(c, [[3, 0], [15, -4]], C.ink, 1.6); }
    c.restore(); circle(c, x + w / 2 + 34, top + 22, 17, null, C.ink2, 1);
    text(c, L('涡轮', 'Turbo'), x + w / 2 + 34, top + 58, { size: 12, color: C.ink2, align: 'center' });
  }
  return [x, top + h / 2];
}

function chart(c, t, ambient) {
  const { x0, x1, y0, y1 } = CHART;
  stroke(c, [[x0, y1 - 10], [x0, y0], [x1, y0]], C.ink, 1.4);
  for (let v = 0.5; v <= 2; v += 0.5) {
    stroke(c, [[x0, cy(v)], [x1, cy(v)]], C.faint, 1, v === 1 ? null : [3, 5]);
    text(c, Math.round(v * 100) + '%', x0 - 10, cy(v) + 5, { size: 12, color: C.ink2, font: MONO, align: 'right' });
  }
  for (let s = 0; s <= T_MAX; s++) text(c, s + ' s', cx(s), y0 + 22, { size: 12, color: C.ink2, font: MONO, align: 'center' });
  text(c, L('动力（自然吸气 · 海平面 = 100%）', 'Power (NA at sea level = 100%)'), x0, y1 - 22, { size: 13, color: C.ink2 });
  if (t < 0) {
    text(c, L('点「地板油！」开始', 'Press "Floor it!" to start'), (x0 + x1) / 2, (y0 + y1) / 2 + 6, { size: 17, color: C.ink2, align: 'center' });
    return [(x0 + x1) / 2, (y0 + y1) / 2];
  }
  for (const m of MODES) {
    const pts = [];
    for (let s = 0; s <= Math.min(t, T_MAX) + 1e-9; s += 0.04) pts.push([cx(s), cy(power(m.id, s, ambient))]);
    stroke(c, pts, lineStyle(m.id), m.id === 'turbo' ? 3 : 2.2, m.line.length ? m.line : null);
    const end = pts[pts.length - 1];
    // Label each line at its current end, kept inside the chart.
    const lx = Math.min(end[0], x1) - 4, ly = end[1] + (m.id === 'na' ? 18 : m.id === 'super' ? 16 : -10);
    text(c, L(...m.name) + ' ' + Math.round(power(m.id, Math.min(t, T_MAX), ambient) * 100) + '%', lx, ly, { size: 13, color: lineStyle(m.id), weight: 600, align: end[0] > x0 + 160 ? 'right' : 'left' });
  }
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}

export function drawThrottle(c, st) {
  const ambient = ALTITUDES[st.alt]?.pressure ?? P_SEA;
  const anchors = {};
  for (const m of MODES) part(c, m.jar, () => { anchors[m.jar] = jar(c, m, st.t ?? -1, ambient, st.time); });
  part(c, 'chart', () => { anchors.chart = chart(c, st.t ?? -1, ambient); });
  part(c, 'alt', () => text(c, st.alt === 'high' ? L('海拔 3650 米（约拉萨）· 空气稀薄', '3,650 m (about Lhasa) · thin air') : L('海平面', 'Sea level'), 976, 30, { size: 13, color: st.alt === 'high' ? C.accent : C.ink2, align: 'right' }));
  anchors.alt = [940, 26];
  if (!st.preview) callouts(c, anchors, SPOTS, st.parts);
  figLabel(c, st.figure);
}

export const throttleView = {
  draw: drawThrottle,
  update(st, dt) { if (st.t === undefined) st.t = -1; if (st.t >= 0 && st.playing) st.t = Math.min(T_MAX + 0.5, st.t + dt); },
  bind(root, st, render) {
    root.querySelector('#floor')?.addEventListener('click', () => { st.t = 0; st.playing = true; render(); });
    root.querySelectorAll('[data-alt]').forEach(b => b.addEventListener('click', () => {
      st.alt = b.dataset.alt; st.t = -1;
      root.querySelectorAll('[data-alt]').forEach(x => x.setAttribute('aria-pressed', x.dataset.alt === st.alt));
    }));
  }
};
