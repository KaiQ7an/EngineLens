import { MODES } from '../sim/powertrain.js';
import { C, MONO, part, text, rect, circle, stroke, fillCut, alpha, pointAt, pathLength, clamp } from './kit.js';
import { drawCylinder } from './engine.js';
import { note } from './induction.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

// Block diagram of a hybrid or range-extender drivetrain. Electricity is drawn as
// yellow dots on the wires, fuel as orange dots, and turning shafts as moving dashes.
const ENGINE = [250, 262], GEN = [450, 250], MOTOR = [620, 520], WHEEL = [870, 520], DRIVE = [760, 520];
const BATTERY = { x: 370, y: 482, w: 160, h: 76 }, TANK = { x: 50, y: 170, w: 80, h: 110 }, PLUG = [292, 520];
const PATHS = {
  fuel: { pts: [[130, 240], [212, 240]], kind: 'fuel' },
  'engine-gen': { pts: [[282, 250], [402, 250]], kind: 'shaft' },
  'engine-wheels': { pts: [[498, 250], [DRIVE[0], 250], DRIVE, [WHEEL[0], DRIVE[1]]], kind: 'shaft' },
  'gen-battery': { pts: [[430, 298], [430, BATTERY.y]], kind: 'wire' },
  'gen-motor': { pts: [[470, 298], [470, 400], [MOTOR[0], 400], [MOTOR[0], MOTOR[1] - 48]], kind: 'wire' },
  'battery-motor': { pts: [[BATTERY.x + BATTERY.w, 520], [MOTOR[0] - 48, 520]], kind: 'wire' },
  'motor-wheels': { pts: [[MOTOR[0] + 48, 520], DRIVE, [WHEEL[0], DRIVE[1]]], kind: 'shaft' },
  'plug-battery': { pts: [[PLUG[0] + 22, 520], [BATTERY.x, 520]], kind: 'wire' }
};
const REVERSE = { 'motor-battery': 'battery-motor', 'wheels-motor': 'motor-wheels' };
const NAMES = {
  ev: ['纯电驱动', 'Electric drive'], series: ['发动机发电', 'Engine generating'], extend: ['增程发电', 'Range extender on'],
  parallel: ['发动机直驱', 'Engine driving'], regen: ['动能回收', 'Regenerating'], plug: ['插电充电', 'Plugged in']
};

function moving(c, pts, kind, time) {
  const len = pathLength(pts);
  if (kind === 'shaft') {
    c.save(); c.setLineDash([10, 8]); c.lineDashOffset = -time * 60;
    stroke(c, pts, C.ink, 4); c.restore();
    return;
  }
  const color = kind === 'fuel' ? C.burn : C.accent;
  for (let d = (time * 80) % 24; d < len; d += 24) { const [x, y] = pointAt(pts, d); circle(c, x, y, 3.6, color); }
}

function base(c, hasClutch) {
  for (const [name, { pts, kind }] of Object.entries(PATHS)) {
    if (name === 'engine-wheels' && !hasClutch) continue;
    if (name === 'plug-battery') continue;
    if (kind === 'shaft') { stroke(c, pts, C.ink2, 9); stroke(c, pts, C.paper, 5); }
    else stroke(c, pts, alpha(C.ink2, 0.8), kind === 'fuel' ? 6 : 2.5);
  }
}

function machine(c, [x, y], letter, angle, on) {
  circle(c, x, y, 48, C.paper, C.ink, 1.6);
  c.beginPath(); c.arc(x, y, 48, 0, Math.PI * 2); c.arc(x, y, 36, 0, Math.PI * 2, true); fillCut(c);
  c.save(); c.translate(x, y); c.rotate(angle);
  c.beginPath(); c.arc(0, 0, 30, -Math.PI / 2, Math.PI / 2); c.closePath(); c.fillStyle = alpha(C.ink, on ? 0.22 : 0.1); c.fill();
  c.restore();
  circle(c, x, y, 30, null, C.ink, 1.4);
  text(c, letter, x, y + 9, { size: 26, weight: 900, align: 'center' });
}

function battery(c, soc, dir) {
  const { x, y, w, h } = BATTERY;
  rect(c, x, y, w, h, 8, C.paper, C.ink, 1.6);
  rect(c, x + w, y + h / 2 - 12, 8, 24, 3, C.ink);
  const cells = 6, cw = (w - 20) / cells;
  for (let i = 0; i < cells; i++) {
    const lit = (i + 1) / cells <= soc + 0.001 || i / cells < soc;
    rect(c, x + 10 + i * cw, y + 10, cw - 4, h - 20, 3, lit ? alpha(C.accent, dir > 0 ? 0.85 : 0.6) : null, C.ink2, 1);
  }
  text(c, Math.round(soc * 100) + '%', x + w / 2, y + h + 26, { size: 16, font: MONO, weight: 600, align: 'center' });
  text(c, dir > 0 ? L('充电中', 'charging') : dir < 0 ? L('放电中', 'discharging') : '', x + w / 2, y + h + 46, { size: 13, color: dir > 0 ? C.accent : C.ink2, align: 'center' });
}

function wheel(c, angle) {
  const [x, y] = WHEEL;
  circle(c, x, y, 82, null, C.ink, 14);
  circle(c, x, y, 82, null, C.paper, 9);
  circle(c, x, y, 66, null, C.ink, 1.4);
  c.save(); c.translate(x, y); c.rotate(angle);
  for (let i = 0; i < 5; i++) { c.rotate(Math.PI * 2 / 5); stroke(c, [[12, 0], [62, 0]], C.ink, 3); }
  c.restore();
  circle(c, x, y, 14, C.paper, C.ink, 1.6);
}

export function drawPowertrain(c, st, entry, { clutch }) {
  const { time, parts } = st;
  const mode = st.step?.mode ?? 'ev', m = MODES[mode], anchors = {};
  base(c, clutch);
  // Active energy flows.
  for (const f of m.flows) {
    const path = PATHS[f] ?? PATHS[REVERSE[f]];
    if (!path) continue;
    const pts = PATHS[f] ? path.pts : [...path.pts].reverse();
    moving(c, pts, path.kind, time);
  }
  part(c, 'tank', () => {
    const { x, y, w, h } = TANK;
    rect(c, x, y, w, h, 8, C.paper, C.ink, 1.6);
    rect(c, x + 6, y + h * 0.4, w - 12, h * 0.6 - 6, 4, alpha(C.burn, 0.55));
    text(c, L('油箱', 'Fuel'), x + w / 2, y - 12, { size: 14, weight: 700, align: 'center' });
  });
  anchors.tank = [TANK.x + TANK.w / 2, TANK.y + TANK.h / 2];
  part(c, 'engine', () => {
    drawCylinder(c, st.eng ?? 0, { x: ENGINE[0], y: ENGINE[1], s: 0.34, air: 8, time, flowRate: m.engine ? 1 : 0 });
    text(c, m.engine ? L('发动机：运转', 'Engine: running') : L('发动机：熄火', 'Engine: off'), ENGINE[0], 330, { size: 14, weight: 700, align: 'center', color: m.engine ? C.burn : C.ink2 });
  });
  anchors.engine = [ENGINE[0], ENGINE[1] - 70];
  part(c, 'generator', () => machine(c, GEN, 'G', st.eng * Math.PI / 180 || 0, m.engine));
  anchors.generator = GEN;
  if (clutch) {
    part(c, 'clutch', () => {
      const x = 600, gap = m.clutch ? 2 : 12;
      rect(c, x - gap - 8, 214, 8, 72, 2, C.paper, C.ink, 1.6);
      rect(c, x + gap, 214, 8, 72, 2, C.paper, C.ink, 1.6);
      text(c, m.clutch ? L('离合器：结合', 'Clutch: engaged') : L('离合器：分开', 'Clutch: open'), x, 316, { size: 13, weight: 600, align: 'center', color: m.clutch ? C.accent : C.ink2 });
    });
    anchors.clutch = [600, 250];
  } else {
    part(c, 'no-link', () => {
      stroke(c, [[506, 250], [700, 250]], C.ink2, 2, [6, 6]);
      stroke(c, [[590, 236], [618, 264]], C.accent, 3); stroke(c, [[590, 264], [618, 236]], C.accent, 3);
      text(c, L('发动机和车轮之间：没有连接', 'Engine to wheels: no link'), 604, 214, { size: 13.5, weight: 700, align: 'center', color: C.accent });
    });
    anchors['no-link'] = [604, 250];
  }
  part(c, 'battery', () => battery(c, st.soc ?? 0.6, m.battery));
  anchors.battery = [BATTERY.x + BATTERY.w / 2, BATTERY.y];
  part(c, 'plug', () => {
    const [x, y] = PLUG, plugged = mode === 'plug';
    rect(c, x - 22, y - 18, 30, 36, 6, plugged ? alpha(C.accent, 0.3) : C.paper, C.ink, 1.6);
    stroke(c, [[x - 30, y - 8], [x - 22, y - 8]], C.ink, 3); stroke(c, [[x - 30, y + 8], [x - 22, y + 8]], C.ink, 3);
    stroke(c, [[x + 8, y], [BATTERY.x, y]], plugged ? C.accent : C.ink2, 2.5, plugged ? null : [4, 4]);
    text(c, L('充电口', 'Charge port'), x - 8, y + 42, { size: 13, color: C.ink2, align: 'center' });
  });
  anchors.plug = PLUG;
  part(c, 'motor', () => machine(c, MOTOR, 'M', (st.wheel ?? 0) * 3, m.flows.some(f => f.includes('motor'))));
  anchors.motor = MOTOR;
  part(c, 'wheels', () => { rect(c, DRIVE[0] - 20, DRIVE[1] - 20, 40, 40, 6, C.paper, C.ink, 1.6); wheel(c, st.wheel ?? 0); });
  anchors.wheels = [WHEEL[0], WHEEL[1] - 82];
  text(c, L(...NAMES[mode]), 28, 72, { size: 26, weight: 900 });
  note(c, 700, 70, 280, L('现在 · 示意', 'RIGHT NOW · MODEL'), [
    [L('发动机', 'Engine'), m.engine ? L('运转', 'running') : L('熄火', 'off'), m.engine],
    [L('车轮由谁推', 'Driving the wheels'), m.flows.includes('engine-wheels') ? L('发动机 + 电机', 'engine + motor') : m.speed && mode !== 'regen' ? L('电机', 'motor') : '—'],
    [L('车速', 'Speed'), m.speed + ' km/h']
  ]);
  if (!st.preview) callouts(c, anchors, SPOTS, parts);
  text(c, 'FIG. ' + entry.figure, 28, 748, { size: 12, color: C.ink2, font: MONO, spacing: 1 });
}

const SPOTS = {
  tank: { dx: 0, dy: 100, r: 0 }, engine: { dx: -90, dy: 40, r: 0 }, generator: { dx: 0, dy: -84, r: 0 },
  clutch: { dx: 0, dy: -70, r: 0 }, 'no-link': { dx: -60, dy: 60, r: 0 }, battery: { dx: -60, dy: -40, r: 0 },
  plug: { dx: -40, dy: -50, r: 0 }, motor: { dx: 0, dy: 84, r: 0 }, wheels: { dx: -70, dy: -20, r: 0 }
};

// Engine, motor and wheels keep turning from frame to frame; the battery fills or drains.
export const powertrainView = opts => ({
  draw: (c, st, entry) => drawPowertrain(c, st, entry, opts),
  update(st, dt, entry) {
    const m = MODES[entry.steps[st.step]?.mode] ?? MODES.ev;
    st.soc = clamp((st.soc ?? 0.6) + m.battery * dt * 0.02, 0.18, 0.95);
    if (m.engine) st.eng = (st.eng ?? 0) + 360 * dt * 1.2;
    st.wheel = (st.wheel ?? 0) + m.speed / 30 * dt;
  }
});
