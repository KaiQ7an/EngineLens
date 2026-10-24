import { C, MONO, part, partAny, text, rect, circle, stroke, pipe, fillCut, alpha, pointAt, pathLength, lerp, hash, clamp, figLabel, below } from './kit.js';
import { callouts } from './callouts.js';
import { L } from '../i18n.js';

// One cell of a PEM fuel-cell stack in cross-section. Hydrogen comes down the anode
// channel, splits at the catalyst; protons cross the membrane, electrons go round the
// outside circuit through the motor, and on the cathode side they meet oxygen as water.
const AN = { x0: 150, x1: 290 }, MEM = { x0: 300, x1: 360 }, CA = { x0: 370, x1: 510 }, Y0 = 230, Y1 = 610;
const WIRE = [[295, Y0], [295, 110], [700 - 50, 110]], WIRE_BACK = [[700 + 50, 110], [800, 110], [800, 160], [365, 160], [365, Y0]];
const H2_IN = [[70, 60], [70, 170], [220, 170], [220, Y0]];
const AIR_IN = [[980, 660], [440, 660], [440, Y1]];
const SPOTS = {
  tank: { dx: 70, dy: 10, r: 0 }, anode: { dx: -60, dy: 170, r: 0 }, membrane: { dx: 0, dy: 140, r: 0 },
  cathode: { dx: 110, dy: 60, r: 0 }, circuit: { dx: 0, dy: -60, r: 0 }, water: { dx: 60, dy: 30, r: 0 }
};
const N = 9; // molecules in flight at once

function h2(c, x, y) { circle(c, x - 4.5, y, 4.5, null, C.ink, 1.5); circle(c, x + 4.5, y, 4.5, null, C.ink, 1.5); }
function o2(c, x, y) { circle(c, x - 5, y, 5, C.ink2); circle(c, x + 5, y, 5, C.ink2); }
function drop(c, x, y, s = 1) {
  c.beginPath(); c.moveTo(x, y - 9 * s); c.quadraticCurveTo(x + 7 * s, y, x, y + 5 * s); c.quadraticCurveTo(x - 7 * s, y, x, y - 9 * s);
  c.fillStyle = alpha(C.ink, 0.25); c.fill(); c.strokeStyle = C.ink; c.lineWidth = 1.4; c.stroke();
}

function cell(c) {
  for (const z of [AN, CA]) rect(c, z.x0, Y0, z.x1 - z.x0, Y1 - Y0, 6, alpha(C.ink, 0.04), C.ink, 1.6);
  c.beginPath(); c.rect(MEM.x0, Y0, MEM.x1 - MEM.x0, Y1 - Y0); fillCut(c);
  for (const x of [AN.x1 + 3, CA.x0 - 3]) stroke(c, [[x, Y0], [x, Y1]], C.accent, 3, [2, 5]); // catalyst layers
  text(c, L('负极 · 氢气', 'Anode · hydrogen'), (AN.x0 + AN.x1) / 2, Y1 + 26, { size: 13, weight: 700, align: 'center', fit: 210 });
  text(c, L('质子交换膜', 'Membrane'), (MEM.x0 + MEM.x1) / 2, Y0 - 12, { size: 12.5, weight: 700, align: 'center' });
  text(c, L('正极 · 空气', 'Cathode · air'), (CA.x0 + CA.x1) / 2, Y1 + 26, { size: 13, weight: 700, align: 'center', fit: 210 });
}

export function drawFuelCell(c, st) {
  const { time, parts } = st, anchors = {};
  part(c, 'tank', () => {
    rect(c, 26, 20, 90, 44, 22, null, C.ink, 1.6);
    text(c, L('氢罐', 'H₂ tank'), 71, 48, { size: 14, weight: 700, align: 'center' });
    pipe(c, H2_IN, 18);
  });
  anchors.tank = [71, 42];
  partAny(c, ['anode', 'membrane', 'cathode', 'water'], () => cell(c));
  partAny(c, ['cathode', 'water'], () => { pipe(c, AIR_IN, 22); text(c, L('空气（氧气）', 'Air (oxygen)'), 980, 640, { size: 13, color: C.ink2, align: 'right' }); });
  // The outside circuit through the motor: the only way the electrons can go.
  part(c, 'circuit', () => {
    stroke(c, WIRE, C.ink, 2.5); stroke(c, WIRE_BACK, C.ink, 2.5);
    circle(c, 700, 110, 46, C.paper, C.ink, 1.6);
    text(c, 'M', 700, 120, { size: 26, weight: 900, align: 'center' });
    text(c, L('电流驱动电机', 'Current drives the motor'), 700, 186, { size: 13, color: C.ink2, align: 'center' });
  });
  anchors.circuit = [700, 64];
  const full = [...WIRE, [700, 110], ...WIRE_BACK], wireLen = pathLength(full);
  for (let i = 0; i < N; i++) {
    const f = ((time * 0.16 + i / N) % 1 + 1) % 1, y = lerp(Y0 + 40, Y1 - 40, hash(i * 3 + 1));
    const xi = AN.x0 + 25 + 90 * hash(i * 5 + 2), xc = CA.x0 + 25 + 90 * hash(i * 7 + 3);
    if (f < 0.3) { // hydrogen arrives down the anode channel
      const g = f / 0.3;
      part(c, 'anode', () => h2(c, lerp(220, xi, Math.min(1, g * 1.4)), lerp(Y0 + 10, y, g)));
    } else if (f < 0.62) { // split: protons across the membrane, electrons round the circuit
      const g = (f - 0.3) / 0.32;
      part(c, 'membrane', () => { for (const dy of [-6, 6]) circle(c, lerp(AN.x1 - 4, CA.x0 + 6, g), y + dy, 3.6, C.accent); });
      part(c, 'circuit', () => { for (const k of [0, 1]) { const [ex, ey] = pointAt(full, clamp(g - k * 0.04) * wireLen); circle(c, ex, ey, 3, C.accent, C.ink, 1); } });
    } else if (f < 0.72) { // water forms where protons, electrons and oxygen meet
      part(c, 'cathode', () => drop(c, CA.x0 + 14, y, (f - 0.62) / 0.1));
    } else { // and drips out
      const g = (f - 0.72) / 0.28;
      part(c, 'water', () => drop(c, lerp(CA.x0 + 14, xc, Math.min(1, g * 2)), lerp(y, Y1 + 80, g)));
    }
  }
  for (let i = 0; i < 6; i++) { // oxygen rising through the cathode channel
    const g = ((time * 0.12 + i / 6) % 1 + 1) % 1;
    part(c, 'cathode', () => o2(c, CA.x0 + 40 + 60 * hash(i + 11), lerp(Y1 - 10, Y0 + 20, g)));
  }
  part(c, 'water', () => {
    stroke(c, [[CA.x0 + 70, Y1], [CA.x0 + 70, Y1 + 90]], C.ink2, 1.2, [3, 4]);
    text(c, L('只排出水', 'Only water comes out'), CA.x0 + 84, Y1 + 84, { size: 14, weight: 700 });
  });
  anchors.anode = [(AN.x0 + AN.x1) / 2, Y0 + 120]; anchors.membrane = [(MEM.x0 + MEM.x1) / 2, Y0 + 200];
  anchors.cathode = [(CA.x0 + CA.x1) / 2, Y0 + 120]; anchors.water = [CA.x0 + 70, Y1 + 60];
  // Key and the whole reaction.
  const key = [[h2, L('氢气 H₂', 'Hydrogen H₂')], [(cx, x, y) => circle(cx, x, y, 3.6, C.accent), L('质子 H⁺ / 电子 e⁻', 'Protons H⁺ / electrons e⁻')], [o2, L('氧气 O₂', 'Oxygen O₂')], [drop, L('水 H₂O', 'Water H₂O')]];
  key.forEach(([fn, name], i) => { fn(c, 620, 300 + i * 40); text(c, name, 650, 305 + i * 40, { size: 14, color: C.ink2 }); });
  text(c, '2H₂ + O₂ → 2H₂O + ' + L('电', 'electricity'), 600, 500, { size: 22, weight: 800, font: MONO, fit: 390 });
  text(c, L('不燃烧，没有火焰', 'No burning, no flame'), 600, 500 + below(14, 30), { size: 14, color: C.ink2, fit: 390 });
  if (!st.preview) callouts(c, anchors, SPOTS, parts);
  figLabel(c, st.figure);
}
