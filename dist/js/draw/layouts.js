import { wrap, pistonDrop, sparkGlow } from '../sim/kinematics.js';
import { ENGINES, localAngle, fireAngles, bankIntervals, throwAngle, inlineForces, cylinders, push, pushing, smoothness } from '../sim/firing.js';
import { C, MONO, part, text, rect, circle, stroke, dot, alpha, path, figLabel } from './kit.js';
import { drawCylinder, gasKind, R, L as ROD } from './engine.js';
import { STROKE_NAMES } from './fourstroke.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

const lit = local => sparkGlow(local) > 0 || (wrap(local) >= 360 && wrap(local) < 400);
const bankName = b => (b === 'L' ? L('左排', 'Left bank') : L('右排', 'Right bank'));

// The firing order on a 720° strip, with a playhead at the current crank angle.
function strip(c, theta, engine, bank, { x0, x1, y }, label) {
  const a = wrap(theta), fires = fireAngles(engine), sx = d => x0 + (x1 - x0) * d / 720;
  stroke(c, [[x0, y], [x1, y]], C.ink2, 1.2);
  for (let d = 0; d <= 720; d += 90) stroke(c, [[sx(d), y - 4], [sx(d), y + 4]], C.ink2, 1);
  if (label) text(c, label, x0 - 14, y + 5, { size: 13, color: C.ink2, align: 'right' });
  const mine = Object.entries(fires).filter(([cyl]) => !bank || cyl[0] === bank).sort((p, q) => p[1] - q[1]);
  const inline = engine.banks.length === 1;
  mine.forEach(([cyl, d], i) => {
    const on = wrap(a - d) < 60;
    rect(c, sx(d) - 3, y - 26, 6, 26, 2, on ? C.accent : C.ink);
    text(c, inline ? cyl.slice(1) : cyl, sx(d), y - 34, { size: mine.length > 8 ? 11 : 13, color: on ? C.accent : C.ink, align: 'center', font: MONO, weight: 600 });
    if (bank) { // the gap to the next firing in this bank
      const next = mine[(i + 1) % mine.length][1] + (i === mine.length - 1 ? 720 : 0), gap = next - d;
      if ((d + next) / 2 <= 720) text(c, gap + '°', sx((d + next) / 2), y + 20, { size: 12.5, font: MONO, color: gap === 180 ? C.ink2 : C.accent, align: 'center', weight: 600 });
    }
  });
  stroke(c, [[sx(a), y - 40], [sx(a), y + 8]], C.accent, 2);
  return [sx(a), y - 12];
}

// Total push on the crank through the cycle: with more cylinders it never drops out.
function pushGraph(c, theta, engine, { x0, x1, y0, y1 }) {
  const a = wrap(theta), sx = d => x0 + (x1 - x0) * d / 720;
  let max = 0;
  for (let d = 0; d < 720; d += 4) max = Math.max(max, push(d, engine));
  const sy = v => y0 - (y0 - y1) * v / max;
  const pts = [];
  for (let d = 0; d <= 720; d += 4) pts.push([sx(d), sy(push(d, engine))]);
  path(c, [[x0, y0], ...pts, [x1, y0]]); c.closePath(); c.fillStyle = alpha(C.ink, 0.08); c.fill();
  stroke(c, pts, C.ink, 1.8);
  stroke(c, [[x0, y0], [x1, y0]], C.ink2, 1);
  const now = [sx(a), sy(push(a, engine))];
  stroke(c, [[now[0], y0], now], C.accent, 1.5);
  circle(c, now[0], now[1], 5, C.accent);
  text(c, L('推曲轴的力（示意）', 'Push on the crank (model)'), x0, y1 - 12, { size: 13, color: C.ink2 });
  const n = pushing(a, engine);
  text(c, L(`同时在推：${n} 个缸`, `Pushing now: ${n} cylinder${n === 1 ? '' : 's'}`), x1, y1 - 12, { size: 14, weight: 700, color: n ? C.accent : C.ink2, align: 'right' });
  text(c, L('最弱时 ≈ 最强时的 ', 'Weakest ≈ ') + Math.round(smoothness(engine, 4) * 100) + L('%', '% of strongest'), x1, y0 + 20, { size: 12.5, color: C.ink2, align: 'right' });
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}

function shakeMeter(c, theta, engine, balanced, [x, y]) {
  const h = 110;
  const f = balanced ? 0 : inlineForces(theta, engine, R / ROD).secondary / (4 * R / ROD);
  const still = balanced || engine.firing.length >= 6;
  stroke(c, [[x, y - h / 2], [x, y + h / 2]], C.ink2, 1);
  for (const k of [-1, 0, 1]) stroke(c, [[x - 8, y + k * h / 2], [x + 8, y + k * h / 2]], C.ink2, 1);
  rect(c, x - 18, y - f * h / 2 - 6, 36, 12, 4, still ? C.ink2 : C.accent);
  text(c, L('抖动', 'Shake'), x, y - h / 2 - 16, { size: 14, weight: 700, align: 'center' });
  text(c, balanced ? L('已抵消', 'cancelled') : still ? L('天生平衡', 'balanced') : L('每转两次', '2× per turn'), x, y + h / 2 + 22, { size: 12, color: C.ink2, align: 'center' });
  return [x, y];
}

// ── Inline engines ──────────────────────────────────────────────────
const INLINE = {
  inline4: { y: 650, s: 0.7, order: '1 – 3 – 4 – 2', balance: true },
  inline6: { y: 668, s: 0.58, order: '1 – 5 – 3 – 6 – 2 – 4', balance: false }
};
const BAL = [[292, 734], [698, 734]];

function drawInline(c, st, key) {
  const { theta, time, parts } = st;
  const e = ENGINES[key], cfg = INLINE[key], a = wrap(theta), n = e.firing.length;
  const step = 780 / (n - 1 + 0.6), x0 = 500 - step * (n - 1) / 2;
  const top = cfg.y - 360 * cfg.s;
  const anchors = {};
  part(c, 'crank', () => {
    stroke(c, [[x0 - 80, cfg.y], [x0 + step * (n - 1) + 80, cfg.y]], C.ink, 9); stroke(c, [[x0 - 80, cfg.y], [x0 + step * (n - 1) + 80, cfg.y]], C.paper, 5);
    for (let k = 0; k <= n; k++) rect(c, x0 + step * (k - 0.5) - 11, cfg.y - 15, 22, 30, 4, C.paper, C.ink, 1.4);
  });
  anchors.crank = [500, cfg.y];
  cylinders(e).forEach((cyl, i) => {
    const local = localAngle(a, e, cyl), id = 'cyl' + cyl.slice(1), x = x0 + step * i;
    part(c, id, () => {
      drawCylinder(c, local, { x, y: cfg.y, s: cfg.s, air: n > 4 ? 10 : 14, time, flowRate: 0.9 });
      const on = lit(local);
      text(c, cyl.slice(1), x, top - 44, { size: 30, weight: 900, align: 'center', color: on ? C.accent : C.ink });
      dot(c, x - 22, top - 16, 5, gasKind(local));
      text(c, L(...STROKE_NAMES[Math.floor(wrap(local) / 180)]), x - 10, top - 11, { size: 14, weight: 600, color: C.ink2 });
      if (on) text(c, L('点火！', 'FIRE!'), x + 22, top - 56, { size: 14, weight: 800, color: C.accent });
    });
    anchors[id] = [x, top + 60];
  });
  part(c, 'timeline', () => { anchors.timeline = strip(c, a, e, null, { x0: 150, x1: 790, y: 82 }, L('点火顺序', 'Firing order')); });
  text(c, cfg.order, 810, 87, { size: 14, font: MONO, weight: 600 });
  part(c, 'push', () => { anchors.push = pushGraph(c, a, e, { x0: 150, x1: 790, y0: 236, y1: 150 }); });
  part(c, 'shake', () => { anchors.shake = shakeMeter(c, a, e, st.balance && cfg.balance, [930, 190]); });
  if (cfg.balance) {
    part(c, 'balance', () => {
      if (!st.balance) { text(c, L('平衡轴：关', 'Balance shafts: off'), 500, 752, { size: 13, color: C.ink2, align: 'center' }); return; }
      // Two shafts spin opposite ways at twice crank speed; their weights cancel the shake.
      BAL.forEach(([x, y], i) => {
        circle(c, x, y, 16, C.paper, C.ink, 1.4);
        const ang = (i ? -2 : 2) * a * Math.PI / 180 + (i ? Math.PI : 0);
        c.beginPath(); c.arc(x, y, 13, ang - 0.9, ang + 0.9); c.lineTo(x, y); c.closePath(); c.fillStyle = C.accent; c.fill();
        circle(c, x, y, 3, C.ink);
      });
      text(c, L('平衡轴（2 倍转速，反向旋转）', 'Balance shafts (2× speed, counter-rotating)'), 495, 754, { size: 13, color: C.ink2, align: 'center' });
    });
    anchors.balance = [495, 734];
  }
  if (!st.preview) callouts(c, anchors, inlineSpots(n), parts);
  figLabel(c, st.figure);
}
const inlineSpots = n => ({
  ...Object.fromEntries(Array.from({ length: n }, (_, i) => ['cyl' + (i + 1), { dx: -58, dy: -30, r: 0 }])),
  crank: { dx: 0, dy: 64, r: 0 }, timeline: { dx: -40, dy: -32, r: 0 }, push: { dx: -60, dy: 40, r: 0 },
  shake: { dx: 40, dy: -56, r: 0 }, balance: { dx: 0, dy: -36, r: 0 }
});

const balanceControls = st => `<div class="seg" role="group" aria-label="Balance shafts"><button type="button" data-balance="0" aria-pressed="${!st.balance}">${L('无平衡轴', 'No balance shafts')}</button><button type="button" data-balance="1" aria-pressed="${st.balance}">${L('加平衡轴', 'Balance shafts')}</button></div>`;
export const inline4View = {
  draw: (c, st) => drawInline(c, st, 'inline4'),
  extraControls: balanceControls,
  bind(root, st) {
    root.querySelectorAll('[data-balance]').forEach(b => b.addEventListener('click', () => {
      st.balance = b.dataset.balance === '1';
      root.querySelectorAll('[data-balance]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.balance === '1') === String(st.balance)));
    }));
  }
};
export const inline6View = { draw: (c, st) => drawInline(c, st, 'inline6') };

// ── Bank grid: every cylinder as a small cell, one row per bank ─────
const rowName = b => (b === 'L' || b === 'R' ? bankName(b) : L(b + ' 排', 'Row ' + b));
function bankGrid(c, e, a, x0, y0, gap = 52, rowGap = 92, cellH = 76) {
  const per = e.firing.length / e.banks.length;
  e.banks.forEach((bank, row) => {
    const y = y0 + row * rowGap;
    text(c, rowName(bank), x0 - 12, y + cellH / 2 + 6, { size: 13, color: C.ink2, align: 'right' });
    for (let p = 1; p <= per; p++) {
      const cyl = bank + p, local = localAngle(a, e, cyl), x = x0 + (p - 1) * gap, w = gap - 12;
      const drop = pistonDrop(local, R, ROD) / (2 * R), kind = gasKind(local), on = lit(local);
      rect(c, x, y, w, cellH, 4, null, C.ink, 1.4);
      const crown = y + 6 + drop * (cellH - 42);
      if (kind === 'burning') rect(c, x + 2, y + 2, w - 4, crown - y - 2, 2, alpha(C.burn, on ? 0.8 : 0.35));
      else if (kind === 'exhaust') rect(c, x + 2, y + 2, w - 4, crown - y - 2, 2, alpha(C.ink2, 0.3));
      rect(c, x + 3, crown, w - 6, 18, 3, C.paper2, C.ink, 1.2);
      if (on) circle(c, x + w / 2, y - 8, 4, C.accent);
      if (rowGap > 80) text(c, cyl, x + w / 2, y + cellH + 14, { size: 11, font: MONO, color: C.ink2, align: 'center' });
    }
  });
  return [x0 + (per * gap) / 2, y0 + (e.banks.length * rowGap) / 2];
}

// Front cross-section of a V or boxer: the front cylinder of each bank on one crank.
// The right bank is drawn on the left and the crank turns clockwise, which matches
// the firing convention in sim/firing.js (see throwAngle).
export function frontSection(c, e, a, time, { x, y, s }) {
  const half = e.vAngle / 2;
  const out = {};
  for (const [bank, sign] of [['R', -1], ['L', 1]]) {
    c.save(); c.translate(x, y); c.rotate(sign * half * Math.PI / 180);
    const [hx, hy] = drawCylinder(c, localAngle(a, e, bank + '1'), { x: 0, y: 0, s, air: 12, time, flowRate: 0.9, crankcase: false }).chamber;
    c.restore();
    const ang = sign * half * Math.PI / 180, far = 360 * s + 26;
    out[bank] = [x + Math.cos(ang) * hx - Math.sin(ang) * hy, y + Math.sin(ang) * hx + Math.cos(ang) * hy];
    text(c, bankName(bank), x + Math.sin(ang) * far, y - Math.cos(ang) * far, { size: 14, weight: 700, align: 'center' });
  }
  circle(c, x, y, 104 * s, null, C.ink, 1.4);
  // The V angle between the two cylinder axes, marked out in the gap between the banks.
  if (e.vAngle < 180) {
    const rr = 300 * s, from = -Math.PI / 2 - half * Math.PI / 180, to = -Math.PI / 2 + half * Math.PI / 180;
    for (const q of [from, to]) stroke(c, [[x, y], [x + Math.cos(q) * (rr + 30), y + Math.sin(q) * (rr + 30)]], alpha(C.accent, 0.6), 1, [4, 5]);
    c.beginPath(); c.arc(x, y, rr, from, to); c.strokeStyle = C.accent; c.lineWidth = 1.8; c.stroke();
    text(c, e.vAngle + '°', x, y - rr - 10, { size: 17, weight: 700, color: C.accent, align: 'center', font: MONO });
  }
  return { ...out, front: [x, y] };
}

// ── V6 and V12 ──────────────────────────────────────────────────────
const VCFG = {
  v6: { gap: 64, front: { x: 270, y: 660, s: 0.8 } },
  v12: { gap: 52, front: { x: 270, y: 660, s: 0.8 } }
};
const V_SPOTS = {
  front: { dx: -150, dy: 120, r: 0 }, banks: { dx: 0, dy: -120, r: 0 },
  timeline: { dx: -40, dy: -46, r: 0 }, push: { dx: -60, dy: 50, r: 0 }, rhythm: { dx: -40, dy: -30, r: 0 }
};

function drawV(c, st, key) {
  const { theta, time, parts } = st;
  const e = ENGINES[key], cfg = VCFG[key], a = wrap(theta), anchors = {};
  part(c, 'front', () => { Object.assign(anchors, frontSection(c, e, a, time, cfg.front)); });
  text(c, L('从发动机正前方看', 'Seen from the front'), 40, 52, { size: 13, color: C.ink2 });
  part(c, 'banks', () => { anchors.banks = bankGrid(c, e, a, 600, 64, cfg.gap); });
  part(c, 'timeline', () => { anchors.timeline = strip(c, a, e, null, { x0: 560, x1: 960, y: 362 }, ''); });
  text(c, L('点火顺序：每 ', 'Fires every ') + 720 / e.firing.length + L('° 一次，左右两排轮流', '°, banks taking turns'), 560, 400, { size: 13, color: C.ink2 });
  part(c, 'push', () => { anchors.push = pushGraph(c, a, e, { x0: 560, x1: 960, y0: 560, y1: 470 }); });
  part(c, 'rhythm', () => {
    const gaps = [...new Set(bankIntervals(e, 'L'))].join(' / ');
    text(c, L('每一排自己的点火间隔：', 'Gaps within one bank: ') + gaps + '°', 560, 640, { size: 14, color: C.ink });
  });
  anchors.rhythm = [600, 636];
  if (!st.preview) callouts(c, anchors, V_SPOTS, parts);
  figLabel(c, st.figure);
}
export const v6View = { draw: (c, st) => drawV(c, st, 'v6') };
export const v12View = { draw: (c, st) => drawV(c, st, 'v12') };

// ── Boxer ───────────────────────────────────────────────────────────
const BOXER_SPOTS = {
  front: { dx: 0, dy: 150, r: 0 }, banks: { dx: 0, dy: -120, r: 0 }, cog: { dx: 0, dy: -110, r: 0 },
  timeline: { dx: -40, dy: -46, r: 0 }, push: { dx: -60, dy: 50, r: 0 }
};

// Engine height decides how low it can sit, and so the car's centre of gravity.
function cogCompare(c, x0, y0) {
  const ground = y0 + 150;
  stroke(c, [[x0, ground], [x0 + 400, ground]], C.ink2, 1.2);
  const blocks = [
    { x: x0 + 40, w: 90, h: 150, name: ['直列', 'Inline'] },
    { x: x0 + 220, w: 160, h: 66, name: ['水平对置', 'Boxer'] }
  ];
  for (const b of blocks) {
    c.beginPath(); c.roundRect(b.x, ground - b.h - 6, b.w, b.h, 8); c.fillStyle = alpha(C.ink, 0.08); c.fill(); c.strokeStyle = C.ink; c.lineWidth = 1.4; c.stroke();
    const cy = ground - 6 - b.h / 2;
    circle(c, b.x + b.w / 2, cy, 9, C.accent); circle(c, b.x + b.w / 2, cy, 3, C.paper);
    stroke(c, [[x0, cy], [x0 + 400, cy]], alpha(C.accent, 0.5), 1, [4, 5]);
    text(c, L(...b.name), b.x + b.w / 2, ground + 22, { size: 14, weight: 700, align: 'center' });
  }
  text(c, L('重心', 'Centre of gravity'), x0 + 400, ground - 6 - 66 / 2 - 10, { size: 12.5, color: C.accent, align: 'right' });
  return [x0 + 200, ground - 70];
}

function drawBoxer(c, st) {
  const { theta, time, parts } = st;
  const key = st.boxer === 'flat4' ? 'flat4' : 'flat6', e = ENGINES[key], a = wrap(theta), anchors = {};
  part(c, 'front', () => { Object.assign(anchors, frontSection(c, e, a, time, { x: 280, y: 280, s: 0.68 })); });
  text(c, L('从发动机正前方看：相对的两个活塞同时向外、同时向内', 'From the front: opposite pistons move out and in together'), 40, 52, { size: 13, color: C.ink2 });
  part(c, 'banks', () => { anchors.banks = bankGrid(c, e, a, 640, 92, key === 'flat4' ? 72 : 60); });
  part(c, 'timeline', () => { anchors.timeline = strip(c, a, e, null, { x0: 600, x1: 960, y: 392 }, ''); });
  text(c, (key === 'flat4' ? L('对置四缸 1-3-2-4（斯巴鲁）', 'Flat-four 1-3-2-4 (Subaru)') : L('对置六缸 1-6-2-4-3-5（保时捷）', 'Flat-six 1-6-2-4-3-5 (Porsche)')), 600, 430, { size: 13, color: C.ink2 });
  part(c, 'push', () => { anchors.push = pushGraph(c, a, e, { x0: 600, x1: 960, y0: 620, y1: 520 }); });
  part(c, 'cog', () => { anchors.cog = cogCompare(c, 60, 520); });
  if (!st.preview) callouts(c, anchors, BOXER_SPOTS, parts);
  figLabel(c, st.figure);
}
export const boxerView = {
  draw: drawBoxer,
  extraControls: st => `<div class="seg" role="group" aria-label="Boxer"><button type="button" data-boxer="flat6" aria-pressed="${st.boxer !== 'flat4'}">${L('对置六缸', 'Flat-six')}</button><button type="button" data-boxer="flat4" aria-pressed="${st.boxer === 'flat4'}">${L('对置四缸', 'Flat-four')}</button></div>`,
  bind(root, st) {
    root.querySelectorAll('[data-boxer]').forEach(b => b.addEventListener('click', () => {
      st.boxer = b.dataset.boxer;
      root.querySelectorAll('[data-boxer]').forEach(x => x.setAttribute('aria-pressed', x.dataset.boxer === st.boxer));
    }));
  }
};

// ── W16 ─────────────────────────────────────────────────────────────
const W16_SPOTS = {
  front: { dx: -170, dy: 70, r: 0 }, banks: { dx: 0, dy: -150, r: 0 }, timeline: { dx: -40, dy: -46, r: 0 },
  push: { dx: -60, dy: 50, r: 0 }, turbos: { dx: 0, dy: 70, r: 0 }
};

// Four rows fanned out on one crank, seen from the front: two narrow VR8 blocks in a V.
function wFront(c, e, a, time, { x, y, s }) {
  // Outer rows first, so the inner rows of each block sit on top.
  const order = [0, 3, 1, 2];
  for (const k of order) {
    c.save(); c.translate(x, y); c.rotate(e.angles[k] * Math.PI / 180);
    drawCylinder(c, localAngle(a, e, e.banks[k] + '1'), { x: 0, y: 0, s, air: 8, time, flowRate: 0.9, crankcase: false });
    c.restore();
  }
  circle(c, x, y, 104 * s, null, C.ink, 1.4);
  for (const [sign, zh, en] of [[-1, '左 VR8', 'Left VR8'], [1, '右 VR8', 'Right VR8']]) {
    const q = sign * 45 * Math.PI / 180, far = 360 * s + 34;
    text(c, L(zh, en), x + Math.sin(q) * far, y - Math.cos(q) * far, { size: 14, weight: 700, align: 'center' });
  }
  text(c, L('每个 VR8 里两排只差 15°', 'Two rows 15° apart in each VR8'), x, y + 92, { size: 13, color: C.ink2, align: 'center' });
  return [x, y - 120];
}

function turbos(c, time) {
  text(c, L('四个涡轮', 'Four turbos'), 40, 70, { size: 15, weight: 800 });
  for (let i = 0; i < 4; i++) {
    const x = 70 + i * 92, y = 130;
    circle(c, x, y, 34, null, C.ink, 1.4);
    c.save(); c.translate(x, y); c.rotate(time * (i < 2 ? 9 : 5) * (i % 2 ? -1 : 1));
    for (let k = 0; k < 8; k++) { c.rotate(Math.PI / 4); stroke(c, [[5, 0], [28, -5]], C.ink, 1.4); }
    c.restore();
  }
  text(c, L('低转速先用两个，转速上来后四个一起', 'Two at low revs, all four as the revs rise'), 40, 196, { size: 13, color: C.ink2 });
  return [208, 130];
}

function drawW16(c, st) {
  const { theta, time, parts } = st;
  const e = ENGINES.w16, a = wrap(theta), anchors = {};
  part(c, 'front', () => { anchors.front = wFront(c, e, a, time, { x: 270, y: 640, s: 0.52 }); });
  part(c, 'turbos', () => { anchors.turbos = turbos(c, time); });
  part(c, 'banks', () => { anchors.banks = bankGrid(c, e, a, 640, 54, 56, 72, 56); });
  part(c, 'timeline', () => { anchors.timeline = strip(c, a, e, null, { x0: 560, x1: 970, y: 410 }, ''); });
  text(c, L('16 个缸，每 45° 点一次火（示例顺序）', 'Sixteen cylinders, one firing every 45° (example order)'), 560, 448, { size: 13, color: C.ink2 });
  part(c, 'push', () => { anchors.push = pushGraph(c, a, e, { x0: 560, x1: 970, y0: 640, y1: 540 }); });
  if (!st.preview) callouts(c, anchors, W16_SPOTS, parts);
  figLabel(c, st.figure);
}
export const w16View = { draw: drawW16 };

// ── V8: cross-plane vs flat-plane ───────────────────────────────────
const PANELS = [
  { key: 'v8cross', id: 'cross', ox: 0, title: ['十字曲轴', 'Cross-plane'], sub: ['曲拐指向 4 个方向', 'Throws in four directions'], sound: ['低沉、忽快忽慢的"突突"声', 'A deep, uneven burble'], car: ['如福特 Mustang GT', 'e.g. Ford Mustang GT'] },
  { key: 'v8flat', id: 'flat', ox: 500, title: ['平面曲轴', 'Flat-plane'], sub: ['曲拐只有 2 个方向', 'Throws in two directions'], sound: ['高亢、均匀的尖啸', 'A high, even scream'], car: ['如雪佛兰 Corvette Z06', 'e.g. Chevrolet Corvette Z06'] }
];
const V8_SPOTS = {
  'crank-cross': { dx: 0, dy: 96, r: 0 }, 'crank-flat': { dx: 0, dy: 96, r: 0 },
  'banks-cross': { dx: 0, dy: -96, r: 0 }, 'banks-flat': { dx: 0, dy: -96, r: 0 },
  'timeline-cross': { dx: -160, dy: 0, r: 0 }, 'timeline-flat': { dx: -160, dy: 0, r: 0 }
};

function endView(c, e, a, x, y) {
  const r = 52;
  for (const [side, ang] of [['L', -135], ['R', -45]]) {
    const q = ang * Math.PI / 180;
    stroke(c, [[x, y], [x + Math.cos(q) * 110, y + Math.sin(q) * 110]], C.ink2, 1, [4, 5]);
    text(c, side === 'L' ? L('左排', 'Left') : L('右排', 'Right'), x + Math.cos(q) * 124, y + Math.sin(q) * 124, { size: 13, color: C.ink2, align: 'center' });
  }
  circle(c, x, y, r + 16, null, C.faint, 1);
  for (let p = 1; p <= 4; p++) {
    // The left bank axis points up-left; a throw at 0° points along it at TDC. The crank
    // turns anticlockwise here, so each right-bank cylinder reaches TDC 90° earlier.
    const ang = (-135 - (throwAngle(e, 'L' + p) + a)) * Math.PI / 180;
    const off = (p - 2.5) * 3;
    const px = x + Math.cos(ang) * r + off, py = y + Math.sin(ang) * r + off;
    stroke(c, [[x + off, y + off], [px, py]], C.ink, 7);
    circle(c, px, py, 11, C.paper, C.ink, 1.4);
    text(c, String(p), px, py + 4.5, { size: 12, font: MONO, weight: 600, align: 'center' });
  }
  circle(c, x, y, 12, C.paper, C.ink, 1.4);
  return [x, y];
}

export function drawV8(c, st) {
  const { theta, parts } = st;
  const a = wrap(theta), anchors = {};
  stroke(c, [[500, 30], [500, 730]], C.faint, 1, [5, 6]);
  for (const pnl of PANELS) {
    const e = ENGINES[pnl.key], ox = pnl.ox;
    text(c, L(...pnl.title), ox + 36, 58, { size: 24, weight: 900 });
    text(c, L(...pnl.sub), ox + 36, 84, { size: 14, color: C.ink2 });
    part(c, 'crank-' + pnl.id, () => { anchors['crank-' + pnl.id] = endView(c, e, a, ox + 130, 240); });
    part(c, 'banks-' + pnl.id, () => { anchors['banks-' + pnl.id] = bankGrid(c, e, a, ox + 270, 140); });
    part(c, 'timeline-' + pnl.id, () => {
      strip(c, a, e, 'L', { x0: ox + 90, x1: ox + 460, y: 470 }, L('左排', 'Left'));
      strip(c, a, e, 'R', { x0: ox + 90, x1: ox + 460, y: 560 }, L('右排', 'Right'));
      anchors['timeline-' + pnl.id] = [ox + 270, 515];
      const gaps = [...new Set(bankIntervals(e, 'L'))].join(' / ');
      text(c, L('每排的点火间隔：', 'Gaps within a bank: ') + gaps + '°', ox + 36, 625, { size: 14, color: C.ink2 });
    });
    text(c, L(...pnl.sound), ox + 36, 680, { size: 19, weight: 800, color: pnl.id === 'cross' ? C.ink : C.accent });
    text(c, L(...pnl.car), ox + 36, 706, { size: 13, color: C.ink2 });
  }
  if (!st.preview) callouts(c, anchors, V8_SPOTS, parts);
  figLabel(c, st.figure);
}
