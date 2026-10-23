import { pistonDrop, pinHeight, valveLift, sparkGlow, burnGlow, camAngle, wrap, strokeIndex } from '../sim/kinematics.js';
import { C, part, alpha, hash, clamp, lerp, ease, circle, path, stroke, dot, flow, fillCut, fillPart } from './kit.js';

// One cylinder in cross-section, drawn around its crank centre. Units are local and
// scaled by `s`; the geometry matches the slider-crank model (r = 40, l = 150).
export const R = 40, L = 150;
const BORE = 75, DECK = -240, HEAD = -318, CROWN = 36, SKIRT = 30;
const VALVE_X = 36, PORT_Y = -292;

// What the gas in the cylinder is doing at crank angle θ, as a dot style.
export const GAS_KIND = ['air', 'squeezed', 'burning', 'exhaust'];
export const gasKind = theta => {
  const a = wrap(theta);
  if (a < 180) return 'air';
  if (a < 350) return 'squeezed';
  if (a < 540) return 'burning';
  return 'exhaust';
};

const crownY = theta => -pinHeight(theta, R, L) - CROWN;

// Dots of air inside the cylinder: their number is the air charge, so a turbo
// visibly packs in more. They stream in through the intake valve, crowd together as
// the piston rises, burn, and leave through the exhaust valve.
function gas(c, theta, n, time) {
  const a = wrap(theta), crown = crownY(theta), kind = gasKind(a);
  const intakeFill = a < 180 ? pistonDrop(a, R, L) / (2 * R) : 1;
  const remaining = a >= 540 ? pistonDrop(a, R, L) / (2 * R) : 1;
  const jitter = kind === 'burning' ? 3 : 1.1;
  for (let i = 0; i < n; i++) {
    const u = hash(i * 2 + 1), v = hash(i * 2 + 7), share = i / n;
    let x = lerp(-BORE + 10, BORE - 10, u) + Math.sin(time * 3.1 + i) * jitter;
    let y = lerp(DECK + 9, crown - 8, v) + Math.cos(time * 2.7 + i * 1.7) * jitter;
    let fade = 1;
    if (a < 220 && share >= intakeFill) continue;
    if (a < 220) { // still arriving through the intake valve
      const e = ease(clamp((intakeFill - share) * n / 3.5));
      x = lerp(-VALVE_X + (u - 0.5) * 22, x, e); y = lerp(DECK + 6, y, e);
    }
    if (a >= 540 && share >= remaining) { // pushed out through the exhaust valve
      const q = clamp((share - remaining) * n / 3.5);
      if (q >= 1) continue;
      x = lerp(x, VALVE_X + (u - 0.5) * 22, ease(q)); y = lerp(y, DECK + 4, ease(q)); fade = 1 - q;
    }
    c.globalAlpha = fade;
    dot(c, x, y, kind === 'squeezed' ? 3.6 : 4.2, kind);
  }
  c.globalAlpha = 1;
}

function spring(c, x, top, bottom) {
  const pts = [];
  for (let k = 0; k <= 8; k++) pts.push([x + (k % 2 ? 10 : -10), lerp(top, bottom, k / 8)]);
  stroke(c, pts, C.ink2, 1.3);
}

function head(c, theta, time, { cams, flowRate, density, intakeKind }) {
  const li = valveLift(theta, 'intake'), le = valveLift(theta, 'exhaust');
  const intakePort = [[-118, PORT_Y], [-96, PORT_Y], [-VALVE_X - 6, DECK - 22], [-VALVE_X, DECK - 2]];
  const exhaustPort = [[VALVE_X, DECK - 2], [VALVE_X + 6, DECK - 22], [96, PORT_Y], [118, PORT_Y]];
  part(c, 'cylinder', () => {
    c.beginPath(); c.roundRect(-118, HEAD, 236, DECK - HEAD, 6); fillCut(c);
    c.save(); c.beginPath(); c.rect(-118, HEAD, 236, DECK - HEAD); c.clip(); // ports are cut through the head
    for (const p of [intakePort, exhaustPort]) { stroke(c, p, C.ink, 30); stroke(c, p, C.paper, 27); }
    c.restore();
    stroke(c, [[-9, HEAD], [-9, DECK]], C.ink, 1.2); stroke(c, [[9, HEAD], [9, DECK]], C.ink, 1.2);
    c.fillStyle = C.paper; c.fillRect(-8.4, HEAD + 1, 16.8, DECK - HEAD - 2);
  });
  part(c, 'intake-port', () => flow(c, intakePort, intakeKind, time, { rate: li * flowRate, density, lanes: 2, spread: 9, strength: clamp(li * 3) }));
  part(c, 'exhaust-port', () => flow(c, exhaustPort, 'exhaust', time, { rate: le * flowRate, lanes: 2, spread: 9, strength: clamp(le * 3) }));
  for (const [id, x, lift] of [['intake-valve', -VALVE_X, li], ['exhaust-valve', VALVE_X, le]]) {
    part(c, id, () => {
      const y = DECK - 1 + lift * 16, top = HEAD - 26 + lift * 16;
      stroke(c, [[x, y - 6], [x, top]], C.ink, 5); stroke(c, [[x, y - 6], [x, top]], C.paper2, 2.4);
      spring(c, x, HEAD - 24 + lift * 16, HEAD - 2);
      path(c, [[x - 23, y], [x + 23, y], [x + 7, y - 9], [x - 7, y - 9]]); c.closePath(); fillPart(c);
      c.beginPath(); c.roundRect(x - 14, top - 8, 28, 10, 2); fillPart(c);
    });
  }
  if (cams) part(c, 'cams', () => {
    for (const [x, centre] of [[-VALVE_X, 105], [VALVE_X, 615]]) {
      // The lobe's nose reaches 16 units past the base circle: exactly the valve lift.
      c.save(); c.translate(x, HEAD - 49); c.rotate((camAngle(theta) - centre / 2) * Math.PI / 180);
      c.beginPath(); c.arc(0, 0, 15, Math.PI * 0.85, Math.PI * 0.15); c.quadraticCurveTo(0, 55, -13.4, 6.8); c.closePath();
      fillPart(c);
      circle(c, 0, 0, 4.5, C.ink);
      c.restore();
    }
  });
  part(c, 'spark', () => {
    c.beginPath(); c.roundRect(-10, HEAD - 42, 20, 30, 3); fillPart(c);
    stroke(c, [[-10, HEAD - 30], [10, HEAD - 30]], C.ink, 1); stroke(c, [[-10, HEAD - 22], [10, HEAD - 22]], C.ink, 1);
    stroke(c, [[0, HEAD - 12], [0, DECK - 1]], C.ink, 4);
    const s = sparkGlow(theta);
    if (s > 0) {
      const col = C.burn;
      for (let k = 0; k < 8; k++) {
        const an = k * Math.PI / 4 + 0.2;
        stroke(c, [[Math.cos(an) * 6, DECK + 4 + Math.sin(an) * 6], [Math.cos(an) * (12 + 10 * s), DECK + 4 + Math.sin(an) * (12 + 10 * s)]], alpha(col, s), 2);
      }
      circle(c, 0, DECK + 4, 4 + 3 * s, col);
    }
  });
}

function bottomEnd(c, theta, ghost = 1) {
  const a = theta * Math.PI / 180;
  const pin = [R * Math.sin(a), -R * Math.cos(a)];
  const wrist = [0, -pinHeight(theta, R, L)];
  c.save(); c.globalAlpha *= ghost;
  part(c, 'crank', () => {
    c.save(); c.rotate(a);
    c.beginPath(); c.arc(0, 0, 60, Math.PI * 0.16, Math.PI * 0.84); c.lineTo(-17, 6); c.lineTo(17, 6); c.closePath(); // counterweight
    fillCut(c);
    c.beginPath(); c.roundRect(-19, -R - 18, 38, R + 34, 18); fillPart(c);
    c.restore();
    circle(c, 0, 0, 13, C.paper, C.ink, 1.4); circle(c, 0, 0, 3, C.ink);
  });
  part(c, 'rod', () => {
    const dx = wrist[0] - pin[0], dy = wrist[1] - pin[1], len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
    path(c, [[pin[0] + nx * 12, pin[1] + ny * 12], [wrist[0] + nx * 8, wrist[1] + ny * 8], [wrist[0] - nx * 8, wrist[1] - ny * 8], [pin[0] - nx * 12, pin[1] - ny * 12]]); c.closePath();
    fillPart(c);
    c.beginPath(); c.arc(pin[0], pin[1], 21, 0, Math.PI * 2); fillPart(c);
    circle(c, pin[0], pin[1], 10, C.paper, C.ink, 1.4);
  });
  part(c, 'piston', () => {
    const top = wrist[1] - CROWN;
    c.beginPath(); c.roundRect(-BORE + 2, top, 2 * BORE - 4, CROWN + SKIRT, 4); fillPart(c);
    for (let k = 0; k < 3; k++) stroke(c, [[-BORE + 2, top + 8 + k * 6], [BORE - 2, top + 8 + k * 6]], C.ink, 1.1);
    circle(c, 0, wrist[1], 11, C.paper, C.ink, 1.4);
  });
  c.restore();
}

// Draw a cylinder. Returns anchor points (stage coordinates) for labels and hit tests.
export function drawCylinder(c, theta, o = {}) {
  const { x = 500, y = 640, s = 1, air = 26, time = 0, cams = false, blur = 0, flowRate = 1, density = 1, intakeKind = 'air' } = o;
  c.save(); c.translate(x, y); c.scale(s, s);
  const a = wrap(theta), crown = crownY(theta);
  part(c, 'cylinder', () => {
    for (const x0 of [-BORE - 20, BORE]) { c.beginPath(); c.rect(x0, DECK, 20, 166); fillCut(c); }
    c.beginPath(); c.moveTo(-BORE - 20, DECK + 166); c.lineTo(-96, -42); c.arc(0, 8, 96, Math.PI * 1.15, Math.PI * 1.85, true);
    c.lineTo(BORE + 20, DECK + 166); c.strokeStyle = C.ink; c.lineWidth = 1.4; c.stroke();
  });
  part(c, 'chamber', () => {
    const burn = burnGlow(a);
    if (burn > 0) {
      const col = C.burn;
      const f = c.createRadialGradient(0, DECK + 6, 0, 0, DECK + 6, 26 + (crown - DECK) * 1.3);
      f.addColorStop(0, alpha(col, burn * 0.45)); f.addColorStop(1, alpha(col, 0));
      c.fillStyle = f; c.fillRect(-BORE, DECK, 2 * BORE, crown - DECK);
    }
    gas(c, a, air, time);
  });
  for (let k = 3; k >= 1 && blur > 0; k--) bottomEnd(c, theta - k * 9, 0.16 * blur);
  bottomEnd(c, theta);
  head(c, a, time, { cams, flowRate, density, intakeKind });
  c.restore();
  const at = (lx, ly) => [x + lx * s, y + ly * s];
  return {
    'intake-valve': at(-VALVE_X, DECK + 4), 'exhaust-valve': at(VALVE_X, DECK + 4),
    'intake-port': at(-118, PORT_Y), 'exhaust-port': at(118, PORT_Y),
    spark: at(0, HEAD - 28), cams: at(-VALVE_X, HEAD - 49), chamber: at(0, (DECK + crown) / 2),
    piston: at(-BORE + 22, crown + 24), rod: at(0, (-pinHeight(theta, R, L) - R) / 2), crank: at(-38, 26),
    cylinder: at(BORE + 10, DECK + 100), stroke: strokeIndex(a), scale: s
  };
}
