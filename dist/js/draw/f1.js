import { ENGINES } from '../sim/firing.js';
import { ERAS, electricShare, LAP, zoneAt, speedAt, FLOW } from '../sim/f1.js';
import { C, MONO, part, partAny, text, rect, circle, stroke, fillCut, alpha, pointAt, pathLength, figLabel, para, below } from './kit.js';
import { frontSection } from './layouts.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

// The F1 power unit as a schematic: the 90° V6 and its turbo, the MGU-K geared to the
// crank, the control electronics and the energy store. Energy flows follow a car
// lapping a stylised circuit: harvesting in the braking zones, deploying elsewhere.
const V = { x: 300, y: 590, s: 0.6 };
const COMP = [200, 168], TURB = [400, 168], WR = 44;
const K = [470, 690], CE = [640, 690], ES = [820, 690];
const H_WIRE = [[300, 196], [300, 236], [560, 236], [560, 690], [CE[0] - 44, 690]];
const K_WIRE = [[K[0] + 40, 690], [CE[0] - 44, 690]];
const ES_WIRE = [[CE[0] + 44, 690], [ES[0] - 56, 690]];
const LAPBOX = { x0: 600, x1: 970, y0: 470, y1: 360 };
const SPOTS = {
  ice: { dx: -150, dy: 64, r: 0 }, turbo: { dx: 66, dy: -60, r: 0 }, mguh: { dx: 0, dy: -60, r: 0 },
  mguk: { dx: -90, dy: 40, r: 0 }, ce: { dx: 0, dy: -60, r: 0 }, es: { dx: 0, dy: -60, r: 0 },
  split: { dx: -150, dy: 0, r: 0 }, lap: { dx: -36, dy: -40, r: 0 }, fuel: { dx: 60, dy: -30, r: 0 }
};

function wheel(c, [x, y], spin, label) {
  c.beginPath(); c.arc(x, y, WR + 16, 0, Math.PI * 2); fillCut(c);
  circle(c, x, y, WR + 2, C.paper, C.ink, 1.4);
  c.save(); c.translate(x, y); c.rotate(spin);
  for (let i = 0; i < 9; i++) { c.rotate(Math.PI * 2 / 9); stroke(c, [[7, 0], [WR - 4, -6]], C.ink, 1.5); }
  c.restore();
  circle(c, x, y, 7, C.paper, C.ink, 1.4);
  text(c, label, x, y + WR + 36, { size: 13, color: C.ink2, align: 'center' });
}

// Yellow dots of electricity along a wire; `dir` reverses them, `rate` thins them.
function current(c, pts, dir, rate, time) {
  stroke(c, pts, alpha(C.ink2, 0.8), 2.5);
  if (!dir || rate <= 0) return;
  const run = dir > 0 ? pts : [...pts].reverse(), len = pathLength(run), gap = 24 / Math.max(0.3, rate);
  for (let d = (time * 80) % gap; d < len; d += gap) { const [x, y] = pointAt(run, d); circle(c, x, y, 3.6, C.accent); }
}

function box(c, [x, y], w, h, zh, en) {
  rect(c, x - w / 2, y - h / 2, w, h, 10, C.paper, C.ink, 1.6);
  text(c, L(zh, en), x, y + 6, { size: 15, weight: 700, align: 'center' });
}

function splitBars(c, era) {
  const e = ERAS[era], x0 = 600, x1 = 970, max = 800, sx = v => x0 + (x1 - x0) * v / max;
  text(c, L('最大功率', 'Peak power') + ' · ' + e.label, x0, 70, { size: 15, weight: 800 });
  const rows = [[L('内燃机', 'Engine'), e.ice, era === '2026' ? L('约 400 kW', '≈ 400 kW') : L('约 550 kW（估计）', '≈ 550 kW (est.)'), C.burn], [L('MGU-K 电机', 'MGU-K motor'), e.k, e.k + ' kW', C.accent]];
  rows.forEach(([name, v, shown, color], i) => {
    const y = 70 + below(13, 30) + i * 52;
    text(c, name, x0, y, { size: 13, color: C.ink2 });
    rect(c, x0, y + 8, x1 - x0, 16, 8, alpha(C.ink, 0.08));
    rect(c, x0, y + 8, sx(v) - x0, 16, 8, color);
    text(c, shown, x1, y, { size: 14, font: MONO, weight: 600, align: 'right', color });
  });
  const share = Math.round(electricShare(era) * 100);
  text(c, L(`电在总功率里占 ${share}%`, `Electric share of peak power: ${share}%`), x0, 226, { size: 14, weight: 700, color: era === '2026' ? C.accent : C.ink, fit: x1 - x0 });
  return [x0 + 120, 130];
}

function lapTrace(c, lap) {
  const { x0, x1, y0, y1 } = LAPBOX, sx = p => x0 + (x1 - x0) * p, sy = v => y0 - (y0 - y1) * (v - 80) / 260;
  for (const [i, z] of LAP.entries()) {
    const from = i ? LAP[i - 1].to : 0;
    if (z.zone === 'brake') rect(c, sx(from), y1 - 6, sx(z.to) - sx(from), y0 - y1 + 12, 2, alpha(C.accent, 0.16));
  }
  const pts = [];
  for (let p = 0; p <= 1.0001; p += 0.005) pts.push([sx(Math.min(p, 0.9999)), sy(speedAt(Math.min(p, 0.9999)))]);
  stroke(c, pts, C.ink, 1.8);
  stroke(c, [[x0, y0 + 8], [x1, y0 + 8]], C.ink2, 1);
  const z = zoneAt(lap), car = [sx(lap % 1), sy(speedAt(lap))];
  circle(c, car[0], car[1], 7, C.accent, C.ink, 1.4);
  para(c, L('一圈的车速（示意）· 黄色区域是刹车区', 'Speed over a lap (model) · yellow: braking zones'), x0, y1 - 20, x1 - x0, { size: 13, color: C.ink2, anchor: 'bottom' });
  const names = { deploy: ['放电：电机帮着推', 'Deploying: the motor pushes'], top: ['接近极速：电机出力减小', 'Near top speed: the motor eases off'], brake: ['刹车：电机发电充电', 'Braking: the motor harvests'], corner: ['过弯', 'Cornering'] };
  text(c, L(...names[z.zone]), x0, y0 + 38, { size: 16, weight: 800, color: z.zone === 'brake' ? C.accent : C.ink, fit: x1 - x0 });
  text(c, Math.round(speedAt(lap)) + ' km/h', x0, y0 + 38 + below(16, 28), { size: 16, font: MONO, weight: 600 });
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}

export function drawF1(c, st) {
  const { theta, time, parts } = st;
  const era = st.era ?? '2026', e = ERAS[era], lap = st.lap ?? 0.05, zone = zoneAt(lap).zone, flow = FLOW[zone];
  const anchors = {};
  // Fuel in, on the left.
  part(c, 'fuel', () => {
    rect(c, 18, 646, 128, 56, 10, C.paper, C.ink, 1.6);
    para(c, L('可持续燃料', 'Sustainable fuel'), 82, 680, 116, { size: 13, weight: 700, align: 'center', anchor: 'middle', leading: 1.15 });
    const pts = [[146, 674], [200, 674], [200, 636]];
    stroke(c, pts, alpha(C.ink2, 0.8), 5);
    const run = flow < 0 ? 0 : 1, len = pathLength(pts);
    for (let d = (time * 60) % 22; d < len && run; d += 22) { const [x, y] = pointAt(pts, d); circle(c, x, y, 3.6, C.burn); }
  });
  anchors.fuel = [82, 646];
  part(c, 'ice', () => {
    frontSection(c, ENGINES.v6f1, theta, time, V);
    text(c, L('1.6 升 · 90° V6', '1.6 L · 90° V6'), V.x, V.y + 92, { size: 14, weight: 700, align: 'center' });
  });
  anchors.ice = [V.x, V.y - 60];
  // Turbo: compressor and turbine on one shaft, with the MGU-H between them until 2025.
  const spin = time * (zone === 'brake' || zone === 'corner' ? 6 : 22);
  part(c, 'turbo', () => {
    rect(c, COMP[0], COMP[1] - 6, TURB[0] - COMP[0], 12, 4, C.paper, C.ink, 1.4);
    wheel(c, COMP, -spin, L('压气机', 'Compressor'));
    wheel(c, TURB, spin, L('涡轮', 'Turbine'));
  });
  anchors.turbo = TURB;
  part(c, 'mguh', () => {
    if (e.mguH) {
      rect(c, 270, 138, 60, 60, 8, C.paper, C.ink, 1.6);
      text(c, 'MGU-H', 300, 173, { size: 13, weight: 800, align: 'center', font: MONO });
    } else {
      c.save(); c.setLineDash([5, 5]); rect(c, 270, 138, 60, 60, 8, null, C.ink2, 1.4); c.restore();
      stroke(c, [[278, 146], [322, 190]], C.accent, 3); stroke(c, [[278, 190], [322, 146]], C.accent, 3);
      text(c, L('MGU-H：2026 取消', 'MGU-H: gone in 2026'), 300, 122, { size: 13, weight: 700, align: 'center', color: C.accent });
    }
  });
  anchors.mguh = [300, 168];
  if (e.mguH) current(c, H_WIRE, zone === 'brake' || zone === 'corner' ? 0 : 1, 0.6, time); // exhaust energy harvested
  // MGU-K, geared to the crankshaft.
  part(c, 'mguk', () => {
    stroke(c, [[V.x + 20, V.y + 30], [K[0] - 34, K[1] - 16]], C.ink, 6);
    circle(c, K[0], K[1], 40, C.paper, C.ink, 1.6);
    c.beginPath(); c.arc(K[0], K[1], 40, 0, Math.PI * 2); c.arc(K[0], K[1], 30, 0, Math.PI * 2, true); fillCut(c);
    text(c, 'K', K[0], K[1] + 8, { size: 24, weight: 900, align: 'center' });
    text(c, 'MGU-K', K[0], K[1] + 62, { size: 13, weight: 700, align: 'center', font: MONO });
  });
  anchors.mguk = [K[0], K[1] - 40];
  partAny(c, ['mguk', 'ce'], () => current(c, K_WIRE, -flow, Math.abs(flow) * (e.k / 350 + 0.3), time));
  partAny(c, ['ce', 'es'], () => current(c, ES_WIRE, -flow, Math.abs(flow) * (e.k / 350 + 0.3), time));
  part(c, 'ce', () => box(c, CE, 88, 52, '控制电子', 'Control'));
  anchors.ce = [CE[0], CE[1] - 26];
  part(c, 'es', () => {
    box(c, ES, 112, 60, '电池 ES', 'Energy store');
    text(c, flow < 0 ? L('充电中', 'charging') : flow > 0.3 ? L('放电中', 'discharging') : '', ES[0], ES[1] + 52, { size: 13, align: 'center', color: flow < 0 ? C.accent : C.ink2 });
  });
  anchors.es = [ES[0], ES[1] - 30];
  part(c, 'split', () => { anchors.split = splitBars(c, era); });
  part(c, 'lap', () => { anchors.lap = lapTrace(c, lap); });
  if (!st.preview) callouts(c, anchors, SPOTS, parts);
  figLabel(c, st.figure);
}

export const f1View = {
  draw: drawF1,
  extraControls: st => `<div class="seg" role="group" aria-label="Era"><button type="button" data-era="2026" aria-pressed="${(st.era ?? '2026') === '2026'}">2026</button><button type="button" data-era="2014" aria-pressed="${st.era === '2014'}">2014–2025</button></div>`,
  // The car laps continuously; a step that names a zone keeps it looping in that zone.
  update(st, dt, entry) {
    const want = entry.steps[st.step]?.zone;
    let lap = (st.lap ?? 0.05) + dt * 0.08;
    if (want && zoneAt(lap).zone !== want) {
      const z = LAP.findIndex(q => q.zone === want);
      lap = Math.floor(lap) + (z ? LAP[z - 1].to : 0) + 0.002;
    }
    st.lap = lap;
  },
  bind(root, st) {
    root.querySelectorAll('[data-era]').forEach(b => b.addEventListener('click', () => {
      st.era = b.dataset.era;
      root.querySelectorAll('[data-era]').forEach(x => x.setAttribute('aria-pressed', x.dataset.era === st.era));
    }));
  }
};
