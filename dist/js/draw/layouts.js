import { wrap, pistonDrop, sparkGlow } from '../sim/kinematics.js';
import { ENGINES, localAngle, fireAngles, bankIntervals, throwAngle, inlineForces, cylinders } from '../sim/firing.js';
import { C, MONO, part, text, rect, circle, stroke, dot, alpha } from './kit.js';
import { drawCylinder, gasKind, R, L as ROD } from './engine.js';
import { STROKE_NAMES } from './fourstroke.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

// ── Inline-four ─────────────────────────────────────────────────────
const I4 = { xs: [190, 393, 596, 799], y: 632, s: 0.72 };
const STRIP = { x0: 150, x1: 850, y: 92 };
const I4_SPOTS = {
  cyl1: { dx: -64, dy: -40, r: 0 }, cyl2: { dx: -64, dy: -40, r: 0 }, cyl3: { dx: -64, dy: -40, r: 0 }, cyl4: { dx: -64, dy: -40, r: 0 },
  crank: { dx: 0, dy: 70, r: 0 }, timeline: { dx: -40, dy: -34, r: 0 }, shake: { dx: 46, dy: -60, r: 0 }, balance: { dx: 0, dy: 40, r: 0 }
};
const BAL = [[292, 726], [698, 726]];

// The firing order on a 720° strip, with a playhead at the current crank angle.
function strip(c, theta, engine, bank, { x0, x1, y }, label) {
  const a = wrap(theta), fires = fireAngles(engine), sx = d => x0 + (x1 - x0) * d / 720;
  stroke(c, [[x0, y], [x1, y]], C.ink2, 1.2);
  for (let d = 0; d <= 720; d += 90) stroke(c, [[sx(d), y - 4], [sx(d), y + 4]], C.ink2, 1);
  if (label) text(c, label, x0 - 14, y + 5, { size: 13, color: C.ink2, align: 'right' });
  const mine = Object.entries(fires).filter(([cyl]) => !bank || cyl[0] === bank).sort((p, q) => p[1] - q[1]);
  mine.forEach(([cyl, d], i) => {
    const since = wrap(a - d), lit = since < 60;
    rect(c, sx(d) - 3, y - 26, 6, 26, 2, lit ? C.accent : C.ink);
    text(c, bank ? cyl : cyl.slice(1), sx(d), y - 34, { size: 13, color: lit ? C.accent : C.ink, align: 'center', font: MONO, weight: 600 });
    if (bank) { // the gap to the next firing in this bank
      const next = mine[(i + 1) % mine.length][1] + (i === mine.length - 1 ? 720 : 0), gap = next - d, mid = sx(Math.min(720, (d + next) / 2));
      if ((d + next) / 2 <= 720) text(c, gap + '°', mid, y + 20, { size: 12.5, font: MONO, color: gap === 180 ? C.ink2 : C.accent, align: 'center', weight: 600 });
    }
  });
  stroke(c, [[sx(a), y - 40], [sx(a), y + 8]], C.accent, 2);
  return [sx(a), y - 12];
}

function shakeMeter(c, theta, balanced) {
  const x = 940, y = 230, h = 120;
  const f = balanced ? 0 : inlineForces(theta, ENGINES.inline4, R / ROD).secondary / (4 * R / ROD);
  stroke(c, [[x, y - h / 2], [x, y + h / 2]], C.ink2, 1);
  for (const k of [-1, 0, 1]) stroke(c, [[x - 8, y + k * h / 2], [x + 8, y + k * h / 2]], C.ink2, 1);
  const yy = y - f * h / 2;
  rect(c, x - 18, yy - 6, 36, 12, 4, balanced ? C.ink2 : C.accent);
  text(c, L('抖动', 'Shake'), x, y - h / 2 - 16, { size: 14, weight: 700, align: 'center' });
  text(c, balanced ? L('已抵消', 'cancelled') : L('每转两次', '2× per turn'), x, y + h / 2 + 22, { size: 12, color: C.ink2, align: 'center' });
  return [x, y];
}

export function drawInline4(c, st) {
  const { theta, time, parts } = st;
  const e = ENGINES.inline4, a = wrap(theta);
  const anchors = {};
  part(c, 'crank', () => {
    stroke(c, [[120, I4.y], [880, I4.y]], C.ink, 9); stroke(c, [[120, I4.y], [880, I4.y]], C.paper, 5);
    for (const x of [100, 300, 500, 700, 900]) rect(c, x - 12, I4.y - 16, 24, 32, 4, C.paper, C.ink, 1.4);
  });
  anchors.crank = [500, I4.y];
  cylinders(e).forEach((cyl, i) => {
    const local = localAngle(a, e, cyl), id = 'cyl' + cyl.slice(1), x = I4.xs[i];
    part(c, id, () => {
      drawCylinder(c, local, { x, y: I4.y, s: I4.s, air: 14, time, flowRate: 0.9 });
      const k = Math.floor(wrap(local) / 180), lit = sparkGlow(local) > 0 || (wrap(local) >= 360 && wrap(local) < 400);
      text(c, cyl.slice(1), x, 300, { size: 32, weight: 900, align: 'center', color: lit ? C.accent : C.ink });
      dot(c, x - 24, 332, 5, gasKind(local));
      text(c, L(...STROKE_NAMES[k]), x - 12, 337, { size: 15, weight: 600, color: C.ink2 });
      if (lit) text(c, L('点火！', 'FIRE!'), x + 26, 290, { size: 15, weight: 800, color: C.accent });
    });
    anchors[id] = [x, I4.y - 230];
  });
  part(c, 'timeline', () => { anchors.timeline = strip(c, a, e, null, STRIP, L('点火顺序', 'Firing order')); });
  text(c, '1 – 3 – 4 – 2', STRIP.x1 + 20, STRIP.y + 5, { size: 15, font: MONO, weight: 600 });
  part(c, 'shake', () => { anchors.shake = shakeMeter(c, a, st.balance); });
  part(c, 'balance', () => {
    if (!st.balance) { text(c, L('平衡轴：关', 'Balance shafts: off'), 500, 750, { size: 13, color: C.ink2, align: 'center' }); return; }
    // Two shafts spin opposite ways at twice crank speed; their weights cancel the shake.
    BAL.forEach(([x, y], i) => {
      circle(c, x, y, 18, C.paper, C.ink, 1.4);
      const ang = (i ? -2 : 2) * a * Math.PI / 180 + (i ? Math.PI : 0);
      c.beginPath(); c.arc(x, y, 15, ang - 0.9, ang + 0.9); c.lineTo(x, y); c.closePath(); c.fillStyle = C.accent; c.fill();
      circle(c, x, y, 3, C.ink);
    });
    text(c, L('平衡轴（2 倍转速，反向旋转）', 'Balance shafts (2× speed, counter-rotating)'), 495, 752, { size: 13, color: C.ink2, align: 'center' });
  });
  anchors.balance = [495, 726];
  if (!st.preview) callouts(c, anchors, I4_SPOTS, parts);
  text(c, 'FIG. 3.1', 28, 748, { size: 12, color: C.ink2, font: MONO, spacing: 1 });
}

export const inline4View = {
  draw: drawInline4,
  extraControls: st => `<div class="seg" role="group" aria-label="Balance shafts"><button type="button" data-balance="0" aria-pressed="${!st.balance}">${L('无平衡轴', 'No balance shafts')}</button><button type="button" data-balance="1" aria-pressed="${st.balance}">${L('加平衡轴', 'Balance shafts')}</button></div>`,
  bind(root, st) {
    root.querySelectorAll('[data-balance]').forEach(b => b.addEventListener('click', () => {
      st.balance = b.dataset.balance === '1';
      root.querySelectorAll('[data-balance]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.balance === '1') === String(st.balance)));
    }));
  }
};

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

function banks(c, e, a, x0, y0) {
  ['L', 'R'].forEach((bank, row) => {
    const y = y0 + row * 92;
    text(c, bank === 'L' ? L('左排', 'Left') : L('右排', 'Right'), x0 - 12, y + 44, { size: 13, color: C.ink2, align: 'right' });
    for (let p = 1; p <= 4; p++) {
      const cyl = bank + p, local = localAngle(a, e, cyl), x = x0 + (p - 1) * 52;
      const drop = pistonDrop(local, R, ROD) / (2 * R), kind = gasKind(local), lit = wrap(local) >= 350 && wrap(local) < 395;
      rect(c, x, y, 40, 76, 4, null, C.ink, 1.4);
      const crown = y + 6 + drop * 34;
      if (kind === 'burning') rect(c, x + 2, y + 2, 36, crown - y - 2, 2, alpha(C.burn, lit ? 0.8 : 0.35));
      else if (kind === 'exhaust') rect(c, x + 2, y + 2, 36, crown - y - 2, 2, alpha(C.ink2, 0.3));
      rect(c, x + 3, crown, 34, 18, 3, C.paper2, C.ink, 1.2);
      if (lit) circle(c, x + 20, y - 8, 4, C.accent);
      text(c, cyl, x + 20, y + 94 - 4, { size: 11, font: MONO, color: C.ink2, align: 'center' });
    }
  });
  return [x0 + 90, y0 + 80];
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
    part(c, 'banks-' + pnl.id, () => { anchors['banks-' + pnl.id] = banks(c, e, a, ox + 270, 140); });
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
  text(c, 'FIG. 3.4', 28, 748, { size: 12, color: C.ink2, font: MONO, spacing: 1 });
}
