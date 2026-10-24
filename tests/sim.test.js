import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pistonDrop, strokeAt, valveLift, valvesOverlap, sparkGlow, burnGlow, camAngle } from '../dist/js/sim/kinematics.js';
import { ENGINES, fireAngles, localAngle, bankIntervals, throwAngle, lastFired, inlineForces, interval, pushing, smoothness } from '../dist/js/sim/firing.js';
import { steadyBoost, tipIn, manifold, gauge, parasitic, power, airCharge, ALTITUDES, P_SEA } from '../dist/js/sim/induction.js';
import { compressionTemp, injection, DIESEL_CR, PETROL_CR, AUTOIGNITION_C } from '../dist/js/sim/diesel.js';
import { housing, apex, apexAlpha, rotorAngle, faceStroke, chamberArea } from '../dist/js/sim/rotary.js';
import { phaseCurrents, field, rotorAngle as motorRotor } from '../dist/js/sim/motor.js';
import { FLOWS, MODES, active } from '../dist/js/sim/powertrain.js';
import { ERAS, electricShare, LAP, zoneAt, speedAt } from '../dist/js/sim/f1.js';

const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);
const r = 27, l = 106;

test('piston sits at TDC at 0° and 360°, BDC at 180° and 540°', () => {
  for (const a of [0, 360, 720]) near(pistonDrop(a, r, l), 0);
  for (const a of [180, 540]) near(pistonDrop(a, r, l), 2 * r);
});

test('slider-crank is not a pure sine: the piston is past half stroke at 90°', () => {
  // The connecting rod's angle pulls the piston further down at 90° than cos would.
  assert.ok(pistonDrop(90, r, l) > r);
  near(pistonDrop(90, r, l), r + l - Math.sqrt(l * l - r * r));
});

test('four strokes span 720° in order', () => {
  assert.deepEqual([10, 200, 400, 600].map(strokeAt), ['intake', 'compression', 'power', 'exhaust']);
  near(camAngle(720), 360);
});

test('valves open on their own strokes and overlap only around exhaust TDC', () => {
  assert.ok(valveLift(90, 'intake') > 0.9 && valveLift(90, 'exhaust') === 0);
  assert.ok(valveLift(630, 'exhaust') > 0.9 && valveLift(630, 'intake') === 0);
  for (const a of [270, 360, 450]) assert.equal(valveLift(a, 'intake') + valveLift(a, 'exhaust'), 0);
  assert.ok(valvesOverlap(0) && valvesOverlap(715) && !valvesOverlap(30) && !valvesOverlap(690));
});

test('spark comes just before compression TDC and the burn follows it', () => {
  assert.ok(sparkGlow(352) > 0 && sparkGlow(300) === 0 && sparkGlow(90) === 0);
  assert.ok(burnGlow(380) > 0.8 && burnGlow(560) === 0 && burnGlow(200) === 0);
});

test('inline-four fires 1-3-4-2 every 180°', () => {
  const e = ENGINES.inline4;
  assert.deepEqual(Object.values(fireAngles(e)), [0, 180, 360, 540]);
  assert.deepEqual(bankIntervals(e, 'A'), [180, 180, 180, 180]);
  assert.equal(lastFired(190, e).cyl, 'A3');
  near(localAngle(0, e, 'A1'), 360);
});

test('inline-four: cylinders 1 and 4 move together, 2 and 3 opposite them', () => {
  const e = ENGINES.inline4;
  for (const theta of [0, 47, 133, 290, 611]) {
    const drop = c => pistonDrop(localAngle(theta, e, c), r, l);
    near(drop('A1'), drop('A4'), 1e-6);
    near(drop('A2'), drop('A3'), 1e-6);
  }
});

test('inline-four cancels primary forces but adds up secondary ones', () => {
  const e = ENGINES.inline4;
  for (const theta of [0, 30, 77, 145]) {
    const f = inlineForces(theta, e, 0.25);
    near(f.primary, 0, 1e-9);
    near(f.secondary, 4 * 0.25 * Math.cos(2 * theta * Math.PI / 180), 1e-9);
  }
});

test('V8 fires every 90°; cross-plane banks are uneven, flat-plane banks are even', () => {
  assert.deepEqual(bankIntervals(ENGINES.v8cross, 'L'), [180, 270, 180, 90]);
  assert.deepEqual(bankIntervals(ENGINES.v8cross, 'R'), [180, 90, 180, 270]);
  for (const bank of ['L', 'R']) assert.deepEqual(bankIntervals(ENGINES.v8flat, bank), [180, 180, 180, 180]);
});

test('V8 cylinders sharing a crank throw agree on its direction', () => {
  for (const key of ['v8cross', 'v8flat']) {
    const e = ENGINES[key];
    for (let p = 1; p <= 4; p++) near(throwAngle(e, 'L' + p), throwAngle(e, 'R' + p), 1e-9);
  }
  const throws = e => [1, 2, 3, 4].map(p => throwAngle(e, 'L' + p));
  assert.deepEqual(new Set(throws(ENGINES.v8cross)).size, 4); // four directions: a cross
  assert.deepEqual(new Set(throws(ENGINES.v8flat)).size, 2);  // two directions: flat
});

test('every engine fires at even intervals of 720° / cylinders', () => {
  for (const e of Object.values(ENGINES)) {
    const angles = Object.values(fireAngles(e)).sort((a, b) => a - b);
    angles.forEach((a, i) => near(a, i * interval(e)));
    assert.equal(new Set(e.firing).size, e.firing.length);
  }
});

test('inline-six fires 1-5-3-6-2-4 and is balanced without shafts', () => {
  const e = ENGINES.inline6;
  assert.deepEqual(e.firing.map(c => c.slice(1)).join('-'), '1-5-3-6-2-4');
  for (const theta of [0, 25, 70, 133]) {
    const f = inlineForces(theta, e, 0.25);
    near(f.primary, 0, 1e-9); near(f.secondary, 0, 1e-9);
  }
  const drop = (theta, c) => pistonDrop(localAngle(theta, e, c), r, l);
  for (const theta of [0, 50, 200]) for (const [a, b] of [['A1', 'A6'], ['A2', 'A5'], ['A3', 'A4']]) near(drop(theta, a), drop(theta, b), 1e-6);
});

test('V6 and V12 alternate banks; each bank fires evenly', () => {
  assert.deepEqual(bankIntervals(ENGINES.v6, 'L'), [240, 240, 240]);
  assert.deepEqual(bankIntervals(ENGINES.v12, 'R'), [120, 120, 120, 120, 120, 120]);
  for (const key of ['v6', 'v12']) ENGINES[key].firing.forEach((c, i, all) => assert.notEqual(c[0], all[(i + 1) % all.length][0]));
  // Each V12 bank is an inline-six firing 1-5-3-6-2-4, and its pairs share crank pins.
  const left = ENGINES.v12.firing.filter(c => c[0] === 'L').map(c => c.slice(1)).join('-');
  assert.equal(left, '1-5-3-6-2-4');
  for (let p = 1; p <= 6; p++) near(throwAngle(ENGINES.v12, 'L' + p), throwAngle(ENGINES.v12, 'R' + p), 1e-9);
});

test('boxer: opposite pistons move out and in together', () => {
  for (const key of ['flat4', 'flat6']) {
    const e = ENGINES[key], n = e.firing.length / 2;
    for (const theta of [0, 40, 155, 400]) for (let p = 1; p <= n; p++)
      near(pistonDrop(localAngle(theta, e, 'L' + p), r, l), pistonDrop(localAngle(theta, e, 'R' + p), r, l), 1e-6);
  }
});

test('more cylinders share the work more evenly', () => {
  const s = k => smoothness(ENGINES[k], 2);
  assert.ok(s('inline4') < 0.05);           // the push drops out between firings
  assert.ok(s('inline4') < s('inline6') && s('inline6') < s('v8cross') && s('v8cross') < s('v12'));
  assert.ok(s('v12') > 0.6);
  assert.equal(pushing(400, ENGINES.v12), 3);
  for (let t = 0; t < 720; t += 7) assert.ok(pushing(t, ENGINES.inline4) <= 1);
});

test('naturally aspirated manifold never exceeds ambient pressure', () => {
  for (const alt of Object.values(ALTITUDES))
    for (let t = 0; t <= 4; t += 0.25) assert.ok(gauge('na', t, alt.pressure) <= 0);
  assert.ok(steadyBoost('na', 6000) <= 0);
});

test('turbo boost starts near zero and rises steadily; the blower boosts at once', () => {
  assert.ok(gauge('turbo', 0.15) < 0.05);
  let prev = -Infinity;
  for (let t = 0; t <= 4; t += 0.05) { const p = manifold('turbo', t); assert.ok(p >= prev - 1e-12); prev = p; }
  assert.ok(gauge('turbo', 4) > 0.7);
  assert.ok(gauge('super', 0.5) > 0.9 * gauge('super', 4));
  assert.ok(tipIn('turbo', 0) === 0 && tipIn('super', 1) > 0.99 && tipIn('na', 0) === 1);
});

test('a supercharger costs crankshaft power; a turbo does not', () => {
  assert.ok(parasitic('super', 3) > 0);
  assert.equal(parasitic('turbo', 3), 0);
  assert.ok(power('super', 3) < manifold('super', 3) / (P_SEA * 0.97));
});

test('at altitude NA power falls with pressure, the turbo mostly recovers', () => {
  const high = ALTITUDES.high.pressure;
  near(power('na', 4, high) / power('na', 4), high / P_SEA, 1e-3);
  assert.ok(power('turbo', 4, high) / power('turbo', 4) > 0.85);
  assert.ok(power('super', 4, high) / power('super', 4) < 0.75);
});

test('boost packs more air per cycle', () => {
  assert.ok(airCharge(0.85) > 1.8 && airCharge(-0.03) === 1);
});

test('diesel squeezes the air hotter than a petrol engine, well past self-ignition', () => {
  const top = compressionTemp(360), petrol = compressionTemp(360, PETROL_CR);
  assert.ok(top > 600 && top > petrol && top > AUTOIGNITION_C);
  assert.ok(DIESEL_CR > PETROL_CR);
  let prev = -Infinity;
  for (let a = 180; a <= 360; a += 5) { const t = compressionTemp(a); assert.ok(t >= prev); prev = t; }
  assert.equal(compressionTemp(90), null);
});

test('diesel fuel is injected only around compression TDC', () => {
  assert.ok(injection(365) > 0.5);
  for (const a of [90, 300, 345, 400, 600]) assert.equal(injection(a), 0);
});

test('rotary: the rotor turns at a third of shaft speed with its apexes on the housing', () => {
  near(rotorAngle(6 * Math.PI), 2 * Math.PI);
  for (const phi of [0, 0.7, 2.9, 11.3]) for (let k = 0; k < 3; k++) {
    const [x, y] = apex(phi, k), [hx, hy] = housing(apexAlpha(phi, k));
    near(x, hx, 1e-12); near(y, hy, 1e-12);
  }
});

test('rotary: each face runs the four strokes in order, one power stroke per shaft turn', () => {
  const TAU = Math.PI * 2, step = TAU / 720;
  const seen = [], starts = [];
  for (let phi = 0; phi < 3 * TAU; phi += step) {
    const s = faceStroke(phi, 0);
    if (seen[seen.length - 1] !== s) seen.push(s);
    for (let k = 0; k < 3; k++) if (faceStroke(phi, k) === 2 && faceStroke(phi - step, k) !== 2) starts.push(phi);
  }
  assert.deepEqual(seen.slice(0, 5).map(s => (s - seen[0] + 4) % 4), [0, 1, 2, 3, 0]);
  assert.equal(starts.length, 3);                       // three shaft turns, three power strokes
  near(starts[1] - starts[0], TAU, 2 * step);
});

test('rotary chamber is smallest at the waists and largest across the long axis', () => {
  const at = m => 3 * (m - Math.PI / 3); // shaft angle that puts face 0's middle at housing angle m
  const spark = chamberArea(at(1.5 * Math.PI), 0), widest = chamberArea(at(Math.PI), 0);
  assert.ok(widest / spark > 5);
  assert.equal(faceStroke(at(1.5 * Math.PI) + 0.01, 0), 2); // just past the plugs: power
});

test('three-phase currents make a field of constant strength that turns', () => {
  for (const e of [0, 0.4, 1.9, 3.3, 5.1]) {
    near(phaseCurrents(e).reduce((a, b) => a + b, 0), 0, 1e-12);
    const f = field(e);
    near(f.strength, 1.5, 1e-12);
    near(Math.cos(f.angle), Math.cos(e), 1e-12); near(Math.sin(f.angle), Math.sin(e), 1e-12);
  }
});

test('the rotor trails the field when driving and leads it when regenerating', () => {
  assert.ok(motorRotor(1, 'drive') < 1 && motorRotor(1, 'regen') > 1);
});

test('powertrain modes: every flow is a known path and its ends are active', () => {
  for (const [name, m] of Object.entries(MODES)) {
    const on = active(name);
    for (const f of m.flows) { assert.ok(FLOWS[f], f); FLOWS[f].forEach(c => assert.ok(on.has(c))); }
    assert.equal(on.has('engine'), m.engine, name);
    assert.equal(m.flows.includes('engine-wheels'), m.clutch, name);
  }
});

test('a range extender never drives the wheels from the engine', () => {
  for (const mode of ['ev', 'extend', 'regen', 'plug']) assert.ok(!MODES[mode].flows.includes('engine-wheels'));
  assert.ok(MODES.extend.battery > 0 && MODES.regen.battery > 0 && MODES.ev.battery < 0);
});

test('2026 F1: the motor nearly matches the engine, and the MGU-H is gone', () => {
  assert.ok(electricShare(2026) > 0.45 && electricShare(2026) < 0.5);
  assert.ok(electricShare(2014) < 0.2);
  assert.equal(ERAS[2026].k, 350); assert.equal(ERAS[2014].k, 120);
  assert.ok(!ERAS[2026].mguH && ERAS[2014].mguH);
});

test('the lap zones cover the lap; braking slows the car and deployment speeds it up', () => {
  LAP.forEach((z, i) => assert.ok(z.to > (LAP[i - 1]?.to ?? 0)));
  assert.equal(LAP[LAP.length - 1].to, 1);
  for (const z of LAP) {
    const from = zoneAt(z.to - 1e-6).from, mid = (from + z.to) / 2;
    if (z.zone === 'brake') assert.ok(speedAt(z.to - 0.005) < speedAt(from + 0.005), 'brake ' + mid);
    if (z.zone === 'deploy') assert.ok(speedAt(z.to - 0.005) > speedAt(from + 0.005), 'deploy ' + mid);
  }
  assert.equal(zoneAt(1.25).zone, zoneAt(0.25).zone);
});
