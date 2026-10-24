import { steadyBoost } from '../sim/induction.js';
import { twinBoost, superchargerOn, spool, HANDOVER } from '../sim/twincharge.js';
import { C, MONO, part, text, rect, circle, stroke, pipe, flow, arrow, fillCut, fillPart, clamp, figLabel } from './kit.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

// A twincharger in series: air passes the supercharger (or its bypass), then the
// turbo's compressor, the intercooler and the engine. Below, boost against rpm, and
// how fast an electric compressor spools compared with a turbo.
const SC = [230, 210], COMP = [450, 210], TURB = [450, 330], COOL = [640, 210];
const IN = [[24, 210], [SC[0] - 60, 210]], MID = [[SC[0] + 60, 210], [COMP[0] - 44, 210]];
const BYPASS = [[112, 210], [112, 110], [348, 110], [348, 210]];
const OUT = [[COMP[0] + 44, 210], [COOL[0] - 40, 210]], ENGINE_IN = [[COOL[0] + 40, 210], [860, 210]];
const EXH = [[860, 330], [TURB[0] + 44, 330]], EXH_OUT = [[TURB[0] - 44, 330], [300, 330], [300, 390]];
const CHART = { x0: 80, x1: 600, y0: 690, y1: 480, max: 1 }, SPOOL = { x0: 680, x1: 970, y0: 690, y1: 480, tMax: 3 };
const SPOTS = {
  sc: { dx: 96, dy: -64, r: 0 }, clutch: { dx: -70, dy: 30, r: 0 }, bypass: { dx: 0, dy: -40, r: 0 },
  turbo: { dx: 80, dy: 0, r: 0 }, chart: { dx: -40, dy: -40, r: 0 }, eboost: { dx: -30, dy: -40, r: 0 }
};

function wheel(c, [x, y], spin) {
  c.beginPath(); c.arc(x, y, 44, 0, Math.PI * 2); fillCut(c);
  circle(c, x, y, 32, C.paper, C.ink, 1.4);
  c.save(); c.translate(x, y); c.rotate(spin);
  for (let i = 0; i < 9; i++) { c.rotate(Math.PI * 2 / 9); stroke(c, [[5, 0], [28, -5]], C.ink, 1.4); }
  c.restore();
}

function blower(c, [x, y], spin, on) {
  c.beginPath(); c.roundRect(x - 60, y - 40, 120, 80, 36); fillCut(c);
  c.beginPath(); c.roundRect(x - 50, y - 30, 100, 60, 28); c.fillStyle = C.paper; c.fill(); c.strokeStyle = C.ink; c.lineWidth = 1.4; c.stroke();
  for (const [dx, dir] of [[-22, 1], [22, -1]]) {
    c.save(); c.translate(x + dx, y); c.rotate(on ? spin * dir : 0);
    c.beginPath();
    for (let i = 0; i <= 60; i++) { const t = i / 60 * Math.PI * 2, r = 22 * (0.7 + 0.3 * Math.cos(3 * t)); i ? c.lineTo(Math.cos(t) * r, Math.sin(t) * r) : c.moveTo(Math.cos(t) * r, Math.sin(t) * r); }
    c.closePath(); fillPart(c); c.restore();
  }
}

function boostChart(c, rpm) {
  const { x0, x1, y0, y1, max } = CHART, sx = r => x0 + (x1 - x0) * (r - 1000) / 5500, sy = v => y0 - (y0 - y1) * clamp(v / max);
  stroke(c, [[x0, y1 - 10], [x0, y0], [x1, y0]], C.ink, 1.4);
  for (let r = 1000; r <= 6500; r += 1100) text(c, r.toLocaleString('en'), sx(r), y0 + 20, { size: 11.5, font: MONO, color: C.ink2, align: 'center' });
  text(c, L('增压（bar）随转速', 'Boost (bar) against rpm'), x0, y1 - 22, { size: 13, color: C.ink2 });
  const curve = f => { const pts = []; for (let r = 1000; r <= 6500; r += 50) pts.push([sx(r), sy(f(r))]); return pts; };
  stroke(c, curve(r => steadyBoost('turbo', r)), C.ink2, 2, [7, 5]);
  stroke(c, curve(r => steadyBoost('super', r)), C.ink2, 2, [2, 4]);
  stroke(c, curve(twinBoost), C.accent, 3.5);
  stroke(c, [[sx(HANDOVER), y1], [sx(HANDOVER), y0]], C.faint, 1, [4, 4]);
  text(c, L('交接', 'Handover'), sx(HANDOVER) + 6, y1 + 12, { size: 12, color: C.ink2 });
  const legend = [[L('双增压', 'Twincharged'), C.accent, null], [L('只用涡轮', 'Turbo only'), C.ink2, [7, 5]], [L('只用机械增压', 'Supercharger only'), C.ink2, [2, 4]]];
  legend.forEach(([name, color, dash], i) => { stroke(c, [[x0 + 20 + i * 160, y0 + 44], [x0 + 52 + i * 160, y0 + 44]], color, 3, dash); text(c, name, x0 + 60 + i * 160, y0 + 49, { size: 13, color }); });
  stroke(c, [[sx(rpm), y1], [sx(rpm), y0]], C.ink, 1.5);
  circle(c, sx(rpm), sy(twinBoost(rpm)), 6, C.accent, C.ink, 1.4);
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}

function spoolChart(c, t) {
  const { x0, x1, y0, y1, tMax } = SPOOL, sx = s => x0 + (x1 - x0) * s / tMax, sy = v => y0 - (y0 - y1) * v;
  stroke(c, [[x0, y1 - 10], [x0, y0], [x1, y0]], C.ink, 1.4);
  for (let s = 0; s <= tMax; s++) text(c, s + ' s', sx(s), y0 + 20, { size: 11.5, font: MONO, color: C.ink2, align: 'center' });
  text(c, L('踩下油门后，增压多快到位', 'How fast boost arrives'), x0, y1 - 22, { size: 13, color: C.ink2 });
  const end = t < 0 ? tMax : Math.min(t, tMax);
  for (const [kind, color, dash, name] of [['electric', C.accent, null, L('电动增压', 'Electric')], ['turbo', C.ink2, [7, 5], L('普通涡轮', 'Turbo')]]) {
    const pts = [];
    for (let s = 0; s <= end + 1e-9; s += 0.03) pts.push([sx(s), sy(spool(kind, s))]);
    stroke(c, pts, color, kind === 'electric' ? 3.5 : 2, dash);
    const last = pts[pts.length - 1];
    text(c, name, Math.min(last[0], x1) - 4, last[1] + (kind === 'electric' ? -10 : 18), { size: 13, color, align: 'right', weight: 600 });
  }
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}

export function drawTwin(c, st) {
  const { time, parts } = st, rpm = st.rpm ?? 3000, on = superchargerOn(rpm);
  const anchors = {}, speed = 0.5 + rpm / 4000, density = 1 + twinBoost(rpm) * 1.3;
  pipe(c, IN, 30); flow(c, IN, 'air', time, { rate: speed, spread: 9 });
  part(c, 'bypass', () => {
    pipe(c, BYPASS, 22);
    if (!on) flow(c, BYPASS, 'air', time, { rate: speed, lanes: 1 });
    const open = !on;
    circle(c, 230, 110, 12, C.paper, C.ink, 1.4);
    stroke(c, [[230 - (open ? 10 : 0), 110 - (open ? 2 : 10)], [230 + (open ? 10 : 0), 110 + (open ? 2 : 10)]], C.ink, 2.5);
    text(c, open ? L('旁通阀：打开', 'Bypass: open') : L('旁通阀：关闭', 'Bypass: closed'), 230, 88, { size: 12.5, align: 'center', color: open ? C.accent : C.ink2 });
  });
  anchors.bypass = [230, 110];
  part(c, 'sc', () => {
    pipe(c, MID, 30); if (on) flow(c, MID, 'squeezed', time, { rate: speed, spread: 9 });
    blower(c, SC, time * 6, on);
    text(c, L('机械增压', 'Supercharger'), SC[0], SC[1] + 64, { size: 14, weight: 700, align: 'center' });
  });
  anchors.sc = SC;
  part(c, 'clutch', () => {
    const y = 300, gap = on ? 2 : 10;
    rect(c, SC[0] - gap - 8, y - 22, 8, 44, 2, C.paper, C.ink, 1.4); rect(c, SC[0] + gap, y - 22, 8, 44, 2, C.paper, C.ink, 1.4);
    stroke(c, [[SC[0] - 4, 250], [SC[0] - 4, y - 22]], C.ink2, 2);
    text(c, on ? L('离合器：结合', 'Clutch: engaged') : L('离合器：松开', 'Clutch: open'), SC[0], y + 42, { size: 12.5, align: 'center', color: on ? C.accent : C.ink2 });
  });
  anchors.clutch = [SC[0], 300];
  part(c, 'turbo', () => {
    const spin = time * (2 + steadyBoost('turbo', rpm) * 30);
    pipe(c, OUT, 30); flow(c, OUT, 'squeezed', time, { rate: speed, density, spread: 9, r: 3.2 });
    pipe(c, EXH, 30); flow(c, EXH, 'exhaust', time, { rate: speed, spread: 9 });
    pipe(c, EXH_OUT, 30);
    rect(c, COMP[0] - 4, COMP[1], 8, TURB[1] - COMP[1], 2, C.paper, C.ink, 1.2);
    wheel(c, COMP, -spin); wheel(c, TURB, spin);
    text(c, L('涡轮', 'Turbo'), COMP[0] + 60, (COMP[1] + TURB[1]) / 2 + 5, { size: 14, weight: 700 });
  });
  anchors.turbo = [COMP[0], (COMP[1] + TURB[1]) / 2];
  c.beginPath(); c.roundRect(COOL[0] - 40, COOL[1] - 40, 80, 80, 6); fillCut(c);
  text(c, L('中冷器', 'Intercooler'), COOL[0], COOL[1] + 62, { size: 13, color: C.ink2, align: 'center' });
  pipe(c, ENGINE_IN, 30); flow(c, ENGINE_IN, 'squeezed', time, { rate: speed, density, spread: 9, r: 3.2 });
  rect(c, 860, 160, 110, 220, 12, C.paper, C.ink, 1.6);
  text(c, L('发动机', 'Engine'), 915, 276, { size: 16, weight: 800, align: 'center' });
  arrow(c, 40, 210, 0, C.ink, 8);
  text(c, on ? L('低转速：机械增压在工作', 'Low revs: supercharger working') : L('高转速：只用涡轮', 'High revs: turbo only'), 24, 56, { size: 20, weight: 900 });
  part(c, 'chart', () => { anchors.chart = boostChart(c, rpm); });
  part(c, 'eboost', () => { anchors.eboost = spoolChart(c, st.tip ?? -1); });
  if (!st.preview) callouts(c, anchors, SPOTS, parts);
  figLabel(c, st.figure);
}

export const twinView = {
  draw: drawTwin,
  // A step can set the engine speed it talks about; the slider follows.
  update(st, dt, entry) {
    if (st.tip >= 0) { st.tip += dt; if (st.tip > 5) st.tip = -1; }
    const want = entry.steps[st.step]?.rpm;
    if (want && st.rpmStep !== st.step) {
      st.rpmStep = st.step; st.rpm = want;
      const el = document.getElementById('rpm'), out = document.getElementById('rpm-out');
      if (el) el.value = want;
      if (out) out.textContent = want.toLocaleString('en');
    }
  },
  bind(root, st) { root.querySelector('#tip-in')?.addEventListener('click', () => { st.tip = 0; st.playing = true; }); }
};
