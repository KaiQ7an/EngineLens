import { wrap, strokeIndex } from '../sim/kinematics.js';
import { compressionTemp, injection, DIESEL_CR, PETROL_CR, AUTOIGNITION_C, IGNITE } from '../sim/diesel.js';
import { C, MONO, part, text, rect, circle, stroke, pipe, flow, arrow, dot, alpha, clamp, figLabel } from './kit.js';
import { drawCylinder, gasKind } from './engine.js';
import { STROKE_NAMES } from './fourstroke.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

const CX = 410, CY = 665, S = 1.42;
const INTAKE = [[110, 30], [110, 250], [CX - 118 * S, 250]];
const EXHAUST = [[CX + 118 * S, 250], [670, 250], [670, 30]];
const T_MAX = 800, TH = { x: 770, top: 120, bottom: 520 };
const SPOTS = {
  injector: { dx: 96, dy: -60, r: 24 }, 'glow-plug': { dx: 110, dy: -10, r: 18 },
  'intake-valve': { dx: -120, dy: 34, r: 34 }, 'exhaust-valve': { dx: 120, dy: -30, r: 34 },
  chamber: { dx: 150, dy: 56, r: 46 }, piston: { dx: -116, dy: 26, r: 52 },
  thermo: { dx: -64, dy: 176, r: 0 }, 'exhaust-port': { dx: 40, dy: -40, r: 0 }
};

// What the thermometer shows at crank angle θ: the compression model, then off the
// scale while the fuel burns. Intake and exhaust values are rough, for scale only.
function airTemp(a) {
  if (a < 180) return 30;
  if (a < IGNITE) return compressionTemp(Math.min(a, 360));
  if (a < 540) return Infinity;
  return 450;
}

function thermometer(c, a) {
  const { x, top, bottom } = TH, y = v => bottom - (bottom - top) * clamp(v / T_MAX);
  const temp = airTemp(a);
  rect(c, x - 11, top - 10, 22, bottom - top + 20, 11, alpha(C.ink, 0.06), C.ink, 1.4);
  circle(c, x, bottom + 22, 20, null, C.ink, 1.4);
  const hot = temp === Infinity, level = hot ? top - 6 : y(temp);
  const col = hot ? C.burn : temp > AUTOIGNITION_C ? C.burn : C.ink2;
  rect(c, x - 5, level, 10, bottom + 10 - level, 5, col);
  circle(c, x, bottom + 22, 14, col);
  for (let v = 0; v <= T_MAX; v += 200) {
    stroke(c, [[x - 18, y(v)], [x - 11, y(v)]], C.ink2, 1);
    text(c, v + '°', x - 24, y(v) + 4, { size: 11.5, font: MONO, color: C.ink2, align: 'right' });
  }
  const mark = (v, zh, en, color) => {
    stroke(c, [[x + 11, y(v)], [x + 26, y(v)]], color, 1.5, [3, 3]);
    text(c, L(zh, en), x + 32, y(v) + 4, { size: 12.5, color, weight: 600 });
  };
  mark(compressionTemp(360, DIESEL_CR), '柴油机压缩到这里', 'Diesel gets here', C.accent);
  mark(compressionTemp(360, PETROL_CR), '汽油机只到这里', 'Petrol stops here', C.ink2);
  mark(AUTOIGNITION_C, '柴油自燃 ≈ 210°', 'Self-ignites ≈ 210°', C.ink2);
  const shown = hot ? L('燃烧中 >1500°', 'Burning >1500°') : Math.round(temp) + '°C';
  text(c, L('缸内空气温度', 'Air in the cylinder'), x, top - 26, { size: 13, color: C.ink2, align: 'center' });
  text(c, shown, x, bottom + 70, { size: 18, font: MONO, weight: 600, color: col === C.ink2 ? C.ink : col, align: 'center' });
  return [x, (top + bottom) / 2];
}

export function drawDiesel(c, st) {
  const { theta, time, parts, speed = 20 } = st;
  const a = wrap(theta);
  part(c, 'intake-port', () => {
    pipe(c, INTAKE, 38);
    flow(c, INTAKE, 'air', time, { rate: st.flow.intake, strength: Math.min(1, st.flow.intake * 3), lanes: 2, spread: 12 });
  });
  arrow(c, 110, 70, Math.PI / 2, C.ink, 8);
  text(c, L('只有空气', 'Air only'), 142, 52, { size: 14, color: C.ink2, weight: 500 });
  part(c, 'exhaust-port', () => {
    pipe(c, EXHAUST, 38);
    flow(c, EXHAUST, 'exhaust', time, { rate: st.flow.exhaust, strength: Math.min(1, st.flow.exhaust * 3), lanes: 2, spread: 12 });
  });
  arrow(c, 670, 66, -Math.PI / 2, C.ink, 8);
  text(c, L('废气', 'Exhaust'), 700, 52, { size: 14, color: C.ink2, weight: 500 });
  const anchors = drawCylinder(c, a, { x: CX, y: CY, s: S, air: 26, time, cams: true, diesel: true });
  part(c, 'thermo', () => { anchors.thermo = thermometer(c, a); });
  anchors['exhaust-port'] = [670, 160];
  const k = strokeIndex(a), fuel = injection(a) > 0;
  dot(c, 640, 712, 6, gasKind(a, true));
  text(c, L(...STROKE_NAMES[k]) + (fuel ? L(' · 正在喷油', ' · injecting') : ''), 656, 718, { size: 17, weight: 700, color: fuel ? C.accent : C.ink });
  if (!st.preview) callouts(c, anchors, SPOTS, parts);
  figLabel(c, st.figure);
  return { anchors, speed };
}
